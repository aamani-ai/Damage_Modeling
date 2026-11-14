// "Check how each sources link to each curve": the cells that have a sources-to-curves page (which source gives which
// number on which curve), by catalogue entry ID → the page's path in this repository. The link under Sources in the
// evidence step opens the page on GitHub at `main`, not at the build commit, so an edit to the page shows without a
// data rebuild. To add a cell: put its page at docs/cells/<cell>/SOURCES_TO_CURVES.md and add a line here.
export const SOURCES_TO_CURVES: Record<string, string> = {
  flood_real_estate: "docs/cells/flood_real_estate/SOURCES_TO_CURVES.md",
  tropical_cyclone_wind_real_estate: "docs/cells/tropical_cyclone_wind_real_estate/SOURCES_TO_CURVES.md",
  tropical_cyclone_wind_wind: "docs/cells/tropical_cyclone_wind_wind/SOURCES_TO_CURVES.md",
};
