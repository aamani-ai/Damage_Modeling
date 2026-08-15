# Derivation dossier — TC-wind × Wind Farm model v1.2/docs r2

## What changed

The curve did not change. The denominator did. Model v1.1 applied a tower-state expected-damage curve to
rotor+nacelle+tower value (0.63 of project TIV). The Hurricane consumer review found that this produced a
maximum analytical EAL near 7.78% of project TIV/year and, more importantly, exceeded the failure scope
supported by the Jaimes evidence.

## Corrected bridge

Model v1.2 keeps `V_zero=90 km/h`, `delta_V50=73.3 km/h`, `rho=4.99`, and `max_dr=1`. It uses the same exact
canonical 5 MW target mismatch disclosure but binds the result only to the source-defined tower exposure
unit and the canonical tower share of 0.16. The other 0.84 remains unknown/unsupported.

On the governed Hurricane population, changing only that value scope reduces the analytical maximum from
about 7.78% to about 1.98% of project TIV/year. This is a consequence check, not external financial-range
validation. The model remains screening-grade until target-matched evidence and a governed financial range
exist.
