# Tropical-cyclone wind × solar — physical idea

The lead model-v2.1/docs-r1 proposal answers the practical screening question:

```text
For this TC-wind event and solar architecture,
what fraction of physical replacement value is damaged?
```

It does this without pretending that one plant-wide curve was observed. Array units use architecture-specific
demand. Foundation, power/collection, GSU, SCADA, and civil units use a separate site-facility demand ratio.
Every unit returns a lower/central/upper screening DR, then a named value profile assembles the plant result.

At both normalized demands equal to 1.0, fixed-tilt central physical DR is about 14.4%; the screening range is
about 5.6%–33.4%. At ratio 2.0, central physical DR is about 80.3%.

The output is useful but explicitly Tier 4 where calibration is absent. Frequency, EAL, and tail aggregation
belong to Hazard after it receives the event loss response.

## Read next

- [How the model is built](HOW_THE_MODEL_IS_BUILT.md)
- [Exact model reference](MODEL_REFERENCE.md)
- [V2.1 proposal](../proposed/README_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md)
- [Request guide](../../../extra/guides/tropical_cyclone_wind_solar_v2_1_curve_request_guide.md)
