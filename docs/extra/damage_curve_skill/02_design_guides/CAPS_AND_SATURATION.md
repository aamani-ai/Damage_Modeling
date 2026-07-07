# Caps and saturation

Caps are necessary but dangerous. They can make model outputs look stable while hiding bias.

## Cap types

```text
failure-unit max_DR cap
component value cap
physical replaceable value cap
exposed fraction cap
insurance/claim cap or sublimit  (usually outside M3)
```

## Required cap fields

```yaml
cap_id:
cap_type:
applies_to:
value:
basis:
source_or_reasoning:
cap_binding_policy:
preflight_required:
```

## Cap questions

```text
Does the cap represent physical saturation or value denominator?
Can it bind at ordinary intensities?
Does scalar EAL become biased if cap binds inside event-state spread?
Does the cap suppress tail behavior unsupported by evidence?
Does cap value line up with failure-unit value bucket?
```

## Governance rule

If cap binding can affect scalar EAL, the capability declaration must require cap-binding preflight before scalar EAL is reportable.
