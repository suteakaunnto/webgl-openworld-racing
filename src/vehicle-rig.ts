import * as THREE from "three";

type SignalMode = "off" | "left" | "right" | "hazard";
type WheelPart = { pivot: THREE.Group; base: THREE.Quaternion; front: boolean };
type PopupPart = { pivot: THREE.Group; base: THREE.Quaternion; direction: number; light: THREE.SpotLight };
type LampPart = { material: THREE.MeshStandardMaterial; kind: "head" | "tail" | "signal"; side: "left" | "right" | "both" };

const WHEELS = [
  { label: "front-left", prefix: "Calliper Front L_02_7", starts: ["polySurface33_", "polySurface330_", "mazda:WheelFL6_"], front: true },
  { label: "front-right", prefix: "Calliper Front R_03_27", starts: ["polySurface9_", "polySurface366_", "WheelFL6_"], front: true },
  { label: "rear-left", prefix: "Calliper Rear L_04_47", starts: ["polySurface17_", "polySurface402_", "mazda:WheelRL6_"], front: false },
  { label: "rear-right", prefix: "Calliper Rear R_05_67", starts: ["polySurface25_", "polySurface439_", "WheelRL6_"], front: false }
] as const;

export class VehicleMotionRig {
  private wheels: WheelPart[] = [];
  private popups: PopupPart[] = [];
  private lamps: LampPart[] = [];
  private spinEnabled = false;
  private spinAngle = 0;
  private steering = 0;
  private popupTarget = 0;
  private popupAmount = 0;
  private headlights = false;
  private brake = false;
  private signal: SignalMode = "off";
  private time = 0;

  constructor(private readonly root: THREE.Object3D) {
    root.updateWorldMatrix(true, true);
    this.buildWheels();
    this.buildPopups();
    this.bindLamps();
    this.refreshLamps(false);
  }

  get wheelCount(): number { return this.wheels.length; }
  get popupCount(): number { return this.popups.length; }
  get lampCount(): number { return this.lamps.length; }

  setWheelSpin(enabled: boolean): void { this.spinEnabled = enabled; }
  setSteering(degrees: number): void { this.steering = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(degrees, -35, 35)); }
  setPopup(open: boolean): void { this.popupTarget = open ? 1 : 0; }
  setHeadlights(enabled: boolean): void { this.headlights = enabled; this.refreshLamps(false); }
  setBrake(enabled: boolean): void { this.brake = enabled; this.refreshLamps(false); }
  setSignal(mode: SignalMode): void { this.signal = mode; this.refreshLamps(false); }

  update(dtValue: number): void {
    const dt = Math.min(Math.max(dtValue, 0), 0.05);
    this.time += dt;
    if (this.spinEnabled) this.spinAngle += dt * 8.5;
    const spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.spinAngle);
    const steer = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.steering);
    for (const wheel of this.wheels) {
      wheel.pivot.quaternion.copy(wheel.base);
      if (wheel.front) wheel.pivot.quaternion.multiply(steer);
      wheel.pivot.quaternion.multiply(spin);
    }

    this.popupAmount += (this.popupTarget - this.popupAmount) * Math.min(1, dt * 5.5);
    for (const popup of this.popups) {
      const hinge = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -popup.direction * 0.9 * this.popupAmount);
      popup.pivot.quaternion.copy(popup.base).multiply(hinge);
      popup.light.intensity = this.headlights && this.popupAmount > 0.78 ? 42 : 0;
    }
    this.refreshLamps(Math.floor(this.time * 2.2) % 2 === 0);
  }

  private find(prefix: string): THREE.Object3D | null {
    let found: THREE.Object3D | null = null;
    this.root.traverse((node) => { if (!found && node.name.startsWith(prefix)) found = node; });
    return found;
  }

  private bounds(objects: THREE.Object3D[]): THREE.Box3 {
    this.root.updateWorldMatrix(true, true);
    const inverse = this.root.matrixWorld.clone().invert();
    const result = new THREE.Box3().makeEmpty();
    for (const object of objects) object.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      if (!mesh.geometry.boundingBox) return;
      const relative = new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld);
      result.union(mesh.geometry.boundingBox.clone().applyMatrix4(relative));
    });
    return result;
  }

  private makePivot(parent: THREE.Object3D, center: THREE.Vector3, name: string): { pivot: THREE.Group; base: THREE.Quaternion } {
    this.root.updateWorldMatrix(true, true);
    parent.updateWorldMatrix(true, true);
    const rootQ = this.root.getWorldQuaternion(new THREE.Quaternion());
    const parentQ = parent.getWorldQuaternion(new THREE.Quaternion());
    const base = parentQ.invert().multiply(rootQ);
    const worldCenter = this.root.localToWorld(center.clone());
    const pivot = new THREE.Group();
    pivot.name = name;
    pivot.position.copy(parent.worldToLocal(worldCenter));
    pivot.quaternion.copy(base);
    parent.add(pivot);
    parent.updateWorldMatrix(true, true);
    pivot.updateWorldMatrix(true, true);
    return { pivot, base };
  }

  private buildWheels(): void {
    for (const spec of WHEELS) {
      const assembly = this.find(spec.prefix);
      if (!assembly) continue;
      const parts = assembly.children.filter((child) => spec.starts.some((prefix) => child.name.startsWith(prefix)));
      if (parts.length < 3) continue;
      const box = this.bounds(parts);
      if (box.isEmpty()) continue;
      const result = this.makePivot(assembly, box.getCenter(new THREE.Vector3()), "MotionPivot_" + spec.label);
      for (const part of parts) result.pivot.attach(part);
      this.wheels.push({ pivot: result.pivot, base: result.base, front: spec.front });
    }
  }

  private buildPopups(): void {
    const carBox = this.bounds([this.root]);
    if (carBox.isEmpty()) return;
    const carZ = carBox.getCenter(new THREE.Vector3()).z;
    for (const side of ["L", "R"] as const) {
      const prefix = "mazda:AnimatedHeadLight" + side + "6_";
      const first = this.find(prefix);
      const parent = first?.parent;
      if (!first || !parent) continue;
      const parts = parent.children.filter((child) => child.name.startsWith(prefix));
      if (parts.length < 4) continue;
      const box = this.bounds(parts);
      if (box.isEmpty()) continue;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const direction = center.z >= carZ ? 1 : -1;
      const hinge = new THREE.Vector3(center.x, box.min.y + size.y * 0.12, center.z - direction * Math.max(size.z * 0.38, 0.015));
      const result = this.makePivot(parent, hinge, "PopupHeadlightPivot_" + side);
      for (const part of parts) result.pivot.attach(part);
      const local = center.clone().sub(hinge);
      const light = new THREE.SpotLight(0xffedcf, 0, 28, 0.28, 0.62, 2);
      light.name = "HeadlightBeam_" + side;
      light.position.copy(local);
      const target = new THREE.Object3D();
      target.position.copy(local).add(new THREE.Vector3(0, -0.9, direction * 14));
      result.pivot.add(target);
      light.target = target;
      result.pivot.add(light);
      this.popups.push({ pivot: result.pivot, base: result.base, direction, light });
    }
  }

  private bindLamps(): void {
    this.root.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const names: string[] = [];
      let current: THREE.Object3D | null = mesh;
      while (current) { names.push(current.name); current = current.parent; }
      const path = names.join("/");
      const convert = (source: THREE.Material): THREE.Material => {
        if (!(source instanceof THREE.MeshStandardMaterial)) return source;
        let kind: LampPart["kind"] | null = null;
        if (path.includes("AnimatedHeadLight") && source.name.includes("LightGlassNormal_Clear")) kind = "head";
        else if (path.includes("TailLight") && source.name.includes("LightGlassNormal_Red")) kind = "tail";
        else if (source.name.includes("LightGlassNormal_Orange") && (path.includes("TailLight") || path.includes("FenderF") || path.includes("BumperF"))) kind = "signal";
        if (!kind) return source;
        let side: LampPart["side"] = "both";
        if (path.includes("TailLightL") || path.includes("FenderFL")) side = "left";
        else if (path.includes("TailLightR") || path.includes("FenderFR")) side = "right";
        else if (path.includes("BumperF")) {
          const box = this.bounds([mesh]);
          if (!box.isEmpty()) side = box.getCenter(new THREE.Vector3()).x >= 0 ? "left" : "right";
        }
        const material = source.clone();
        material.emissive.set(kind === "head" ? 0xffe8b8 : kind === "tail" ? 0xff1420 : 0xff7a18);
        material.emissiveIntensity = 0;
        this.lamps.push({ material, kind, side });
        return material;
      };
      if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(convert);
      else if (mesh.material) mesh.material = convert(mesh.material);
    });
  }

  private refreshLamps(blinkOn: boolean): void {
    for (const lamp of this.lamps) {
      let intensity = 0;
      if (lamp.kind === "head") intensity = this.headlights ? 2.2 : 0;
      else if (lamp.kind === "tail") intensity = this.brake ? 2.6 : this.headlights ? 0.35 : 0;
      else {
        const active = this.signal === "hazard" || this.signal === lamp.side || (lamp.side === "both" && this.signal !== "off");
        intensity = active && blinkOn ? 2.4 : 0;
      }
      lamp.material.emissiveIntensity = intensity;
    }
  }
}
