# Decision log — flood_wind model v0.1 / docs r1

| ID | Decision | Reason | Revisit trigger |
|---|---|---|---|
| D-FW-01 | Keep flood_wind as the cell and release boundary. | Hazard × asset remains the consumer and capability unit. | Cell-contract policy changes. |
| D-FW-02 | Create an asset-neutral, non-runtime flood-electrical substrate. | Matched equipment should not differ merely because it serves solar or wind. | Runtime sharing is proposed. |
| D-FW-03 | Freeze local depth above the component vulnerable datum as the method axis. | Contact begins at the component, not universal grade. | A stronger equipment-specific demand is validated. |
| D-FW-04 | Decompose the GSU/substation into distinct failure units. | Controls, DC service, switchgear, transformer systems, and terminations have different datums, dispositions, and values. | A dependency-safe same-replacement-unit assembly is proven. |
| D-FW-05 | Treat FS_SWG as a pinned candidate only. | It is the closest definition/axis match but remains a T3 engineering proxy without flood-wind transfer validation. | Exact applicability and economic validation pass. |
| D-FW-06 | Reject direct FS_XFMR reuse. | Its main-transformer value denominator is mixed with control/terminal exposure semantics. | Main/auxiliary state and cost model is validated. |
| D-FW-07 | Keep scour, erosion, soil support, and debris outside the direct-contact pathway. | Mechanisms and axes differ from inundation contact. | Separate pathway package is curated. |
| D-FW-08 | Publish zero runtime records and withhold every numeric metric. | No numerical record passes the evidence, value, and compatibility gates. | Reviewed output-bearing model release. |
| D-FW-09 | Do not adopt legacy 9% electrical or 9% substation shares. | They are hardcoded placeholders and conflict with the unsplit 72 USD/kW public value row. | Site SOV/BOM and ownership evidence. |
| D-FW-10 | Unknown ownership excludes baseline project physical loss. | Functional association does not prove title or insured inclusion. | Executed agreement, one-line, and value schedule resolve it. |
| D-FW-11 | Missing component identity or datum is unknown, not dry. | A centroid or failed elevation lookup is not observed zero exposure. | Qualified uncertainty/default policy. |
| D-FW-12 | Future consumer cutover must remove both M3 and M4 local reconstructions. | Hazard M4 independently re-hardcodes the provisional coastal response. | Dual-read migration is implemented and verified. |

All decisions were adopted on 2026-07-28 for this research scaffold.

