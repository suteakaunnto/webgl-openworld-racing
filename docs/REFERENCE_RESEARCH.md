# Mazda RX-7 Spirit R Type A (2002) — Reference Research

Research date: 2026-11-21 (JST)
Target: Japanese-market 2002 Mazda RX-7 Spirit R Type A, FD3S final limited-series variant.

This document separates manufacturer-published facts from catalogue data and model-file observations. Missing or ambiguous details are not to be guessed.

## Primary manufacturer announcement

Mazda Motor Corporation, Japanese news release No. 1684, 2002-03-25:
https://newsroom.mazda.com/ja/publicity/release/2002/200203/0325.html

English version:
https://newsroom.mazda.com/en/publicity/release/2002/200203/0325e.html

Key confirmed facts:
- Spirit R was announced on 2002-03-25 and scheduled to go on sale in Japan on 2002-04-22.
- Mazda described it as the final limited-production RX-7 series; the FD3S was expected to end production in August 2002.
- The manufacturer planned 1,500 Spirit R vehicles for the series as a whole. This is not evidence that Type A alone had 1,500 units.
- Three versions were offered: Type A (two seats, five-speed manual), Type B (four seats, five-speed manual), and Type C (four seats, four-speed automatic).
- All three shared 17-inch BBS wheels, red brake calipers, dedicated soft-coated interior panels, a Spirit R ornament and dedicated meters.
- Type A used exclusive red RECARO full-bucket seats. Mazda stated that the lightweight seats reduced vehicle weight by approximately 10 kg.
- Type A and Type B received large drilled four-wheel ventilated disc brakes, high-rigidity stainless-mesh brake hoses, and exclusive Bilstein dampers.
- Type A's BBS wheel finish was gunmetal; Type B and C used silver.
- The series offered five exterior colours, including Spirit R-exclusive Titanium Gray Metallic.
- Mazda's release lists Type A and B at 206 kW (280 PS), while Type C was listed at 188 kW (255 PS).

## Type A dimensions and technical data

Toyota GAZOO catalogue entry for the 2002-04 RX-7 Spirit R Type A:
https://gazoo.com/catalog/maker/MAZDA/RX7/199710/2502954/

| Item | Reference value | Notes |
|---|---:|---|
| Model code | GF-FD3S | Catalogue entry |
| Body | Coupe / hatchback profile | GAZOO lists 3 doors; door-count conventions can differ when the rear hatch is counted |
| Seats | 2 | Type A |
| Overall length | 4,285 mm | GAZOO |
| Overall width | 1,760 mm | GAZOO |
| Overall height | 1,230 mm | GAZOO |
| Wheelbase | 2,425 mm | GAZOO |
| Front / rear tread | 1,460 / 1,460 mm | GAZOO |
| Vehicle weight | 1,270 kg | GAZOO |
| Engine | 13B-REW | Water-cooled, two-rotor rotary, intercooler twin-turbo |
| Displacement | 1,308 cc (654 cc × 2 rotor chambers as commonly presented) | GAZOO lists 1,308 cc |
| Compression ratio | 9.0 | GAZOO |
| Maximum output | 206 kW / 280 PS at 6,500 rpm | GAZOO and Mazda |
| Maximum torque | 314 N·m (32.0 kgf·m) at 5,000 rpm | GAZOO |
| Drivetrain | FR | GAZOO |
| Transmission | 5-speed manual | Type A |
| LSD | Standard | GAZOO |
| Front suspension | Double wishbone | GAZOO |
| Rear suspension | Double wishbone | GAZOO |
| Front / rear brakes | Ventilated discs | GAZOO |
| Front tyres | 235/45ZR17 | GAZOO |
| Rear tyres | 255/40ZR17 | GAZOO |
| Final drive | 4.300 | GAZOO |

## Type A vs Type B vs Type C

The Mazda announcement is the primary source for the key distinctions:

| Feature | Type A | Type B | Type C |
|---|---|---|---|
| Seats | 2 | 4 | 4 |
| Gearbox | 5MT | 5MT | 4AT |
| Maximum output | 280 PS | 280 PS | 255 PS |
| Signature seat | Red RECARO lightweight full bucket | Red leather bucket | Red leather bucket |
| BBS 17-inch finish | Gunmetal | Silver | Silver |
| Large drilled ventilated brakes | Yes | Yes | Not listed as Type C equipment |
| Stainless-mesh brake hoses | Yes | Yes | Not listed as Type C equipment |
| Dedicated Bilstein dampers | Yes | Yes | Standard dampers |

Do not transfer Type B or Type C seating, wheel finish, transmission, or damper details to Type A.

## Structure, exterior, and cockpit observations

Manufacturer announcement confirms the Type A equipment above. The GAZOO catalogue confirms the basic dimensions, front-engine/rear-drive vehicle category, suspension, brakes, wheels, engine output, and transmission.

The following visual traits are part of the supplied model's later geometry audit, not proof of Type A-specific equipment: long low coupe proportions, retractable headlamp assemblies, sculpted front fenders, curved glass, separate front and rear bumper surfaces, rear spoiler, rear combination lamps, and a detailed cockpit. The supplied glTF must be compared against independent reference photographs before any shape correction is approved.

Type A-specific interior priorities for the game:
- Two-seat cockpit layout.
- Red RECARO full-bucket seat design.
- Red stitching on leather steering wheel and manual shift knob.
- Spirit R dedicated meter design and soft-coated interior trim.
- The Type A equipment should be represented distinctly from Type B and C.

## Unconfirmed or intentionally unresolved

- Type A's exact individual production allocation within the 1,500-unit Spirit R series: not confirmed by the cited Mazda release.
- Exact model-year production month for an individual example: not confirmed.
- Individual vehicle's original paint colour: depends on the vehicle being represented.
- Exact front / rear overhang values for Type A from a Type A-specific dimension drawing: not independently verified here.
- Any exact wheel, tyre, or body-part dimensions not listed above: not confirmed.
- Model node names do not prove that a component is positioned, pivoted, or articulated correctly.

## Game design application

1. Use 4.285 × 1.760 × 1.230 m, 2.425 m wheelbase, 1.460 m front and rear track, and 1,270 kg as the first engineering reference values.
2. Use a two-rotor, twin-turbo power curve with the 280 PS / 6,500 rpm and 314 N·m / 5,000 rpm reference points; interpolate a plausible curve only as a game-tuning model and label it as simulated.
3. Use FR, five-speed manual, and a standard limited-slip differential as the baseline handling configuration.
4. Model Type A's two-seat red bucket cockpit, gunmetal BBS-inspired wheel style, drilled ventilated brakes, braided brake hoses, and Bilstein-style damper setup as distinct features.
5. Use the official manufacturer release as the authority for Type A vs B/C equipment differences.
6. The fictional Asterion 13R must receive original game naming and a fictional badge. The Mazda model is credited as a third-party source asset and must not appear as a licensed Mazda vehicle in the game's fictional brand roster.

## Source notes

- Mazda Motor Corporation, Japanese release 1684, 2002-03-25 — primary manufacturer source.
- Mazda Motor Corporation, English release, 2002-03-25 — official translation.
- Toyota GAZOO, RX-7 Spirit R Type A catalogue entry — secondary technical catalogue.
- A 2002 Spirit R brochure is available at https://images.jdm-catalogues.com/mazda/rx-7/fd/type_6/mazda_rx7_fd_type_6_spirit_r/catalogue.pdf. It was consulted as an additional text reference, but its high-size PDF could not be screenshot-rendered in the current research session; visual conclusions are therefore not based on that PDF screenshot.
