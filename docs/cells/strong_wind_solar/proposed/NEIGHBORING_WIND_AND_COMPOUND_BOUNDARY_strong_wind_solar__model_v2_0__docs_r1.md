# Neighboring wind and compound-event boundary — strong_wind_solar v2 proposal

| Incoming event/mechanism | Route | Reason |
|---|---|---|
| Local non-tornadic downburst/microburst/macroburst/gust front | This proposal | Exact pathway |
| Derecho | Only locally resolved non-tornadic outflow; preserve parent event | Derecho can contain downbursts, mesovortices and tornadoes |
| Tropical cyclone/hurricane wind | Noncanonical [`tropical_cyclone_wind_solar` model-v2 research candidate](../../tropical_cyclone_wind_solar/README.md); never fall back to this convective proposal | Duration, profile, rain/debris, control and accumulation differ; the TC candidate's generic records are cell-local synthetic Tier-4 assumptions, not transferred convective evidence |
| Tornado direct hit/debris swath | Future `tornado_solar` pathway/cell | Rotating flow, translation, pressure/debris and narrow-swath exposure differ |
| Synoptic/downslope wind | Separate workstream | Stationarity/profile/duration differ from convective outflow |
| Hail + convective wind | Evaluate separate hail/wind loss atoms, reconcile module disposition | Same module value can otherwise be replaced twice |
| Wind-driven rain/ingress | Separate mechanism | Enclosure/ingress state is not pressure DR |
| Lifetime ambient-wind fatigue | Reliability/lifecycle model | Not an occurrence peak-loss curve |

`pathway_id` must come from the hazard/event model. High wind speed does not prove a pathway. A parent event
may carry multiple mutually partitioned physical pathways, but no local loss atom may be evaluated twice.
