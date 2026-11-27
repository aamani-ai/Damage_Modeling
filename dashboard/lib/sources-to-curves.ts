// "Check how each sources link to each curve": the cells that have a sources-to-curves page (which source gives which
// number on which curve), by catalogue entry ID → the page's path in this repository. The link under Sources in the
// evidence step opens the page on GitHub at `main`, not at the build commit, so an edit to the page shows without a
// data rebuild. To add a cell: put its page at docs/cells/<cell>/SOURCES_TO_CURVES.md and add a line here.
export const SOURCES_TO_CURVES: Record<string, string> = {
  flood_solar: "docs/cells/flood_solar/SOURCES_TO_CURVES.md",
  wildfire_solar: "docs/cells/wildfire_solar/SOURCES_TO_CURVES.md",
  hail_solar: "docs/cells/hail_solar/SOURCES_TO_CURVES.md",
  flood_real_estate: "docs/cells/flood_real_estate/SOURCES_TO_CURVES.md",
  tropical_cyclone_wind_real_estate: "docs/cells/tropical_cyclone_wind_real_estate/SOURCES_TO_CURVES.md",
  tropical_cyclone_wind_wind: "docs/cells/tropical_cyclone_wind_wind/SOURCES_TO_CURVES.md",
  strong_wind_solar: "docs/cells/strong_wind_solar/SOURCES_TO_CURVES.md",
  tropical_cyclone_wind_solar: "docs/cells/tropical_cyclone_wind_solar/SOURCES_TO_CURVES.md",
  hail_wind: "docs/cells/hail_wind/SOURCES_TO_CURVES.md",
  flood_wind: "docs/cells/flood_wind/SOURCES_TO_CURVES.md",
  wind_tornado_wind: "docs/cells/wind_tornado_wind/SOURCES_TO_CURVES.md",
  wildfire_wind: "docs/cells/wildfire_wind/SOURCES_TO_CURVES.md",
  flood_bess: "docs/cells/flood_bess/SOURCES_TO_CURVES.md",
  tropical_cyclone_wind_bess: "docs/cells/tropical_cyclone_wind_bess/SOURCES_TO_CURVES.md",
  wildfire_bess: "docs/cells/wildfire_bess/SOURCES_TO_CURVES.md",
  flood_substation: "docs/cells/flood_substation/SOURCES_TO_CURVES.md",
  hail_real_estate: "docs/cells/hail_real_estate/SOURCES_TO_CURVES.md",
  convective_wind_real_estate: "docs/cells/convective_wind_real_estate/SOURCES_TO_CURVES.md",
  wildfire_real_estate: "docs/cells/wildfire_real_estate/SOURCES_TO_CURVES.md",
};
