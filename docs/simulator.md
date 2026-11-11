# Respondent simulator — `tools/simulate_respondents.py`

Writes fake responses with **known** preferences in exactly the format the survey page will write. If the notebook recovers the known ranking, the analysis works.

## Usage

```bash
python tools/simulate_respondents.py design/studies/<study>.design.json --out analysis/data/<study>.simulated.jsonl [options]
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--n` | 300 | respondents |
| `--seed` | random | reproducible run |
| `--true-utils` | random N(0,1) | JSON `{"I01": 0.0, "I02": -0.3, …}`: mean preference per item |
| `--heterogeneity` | 0.5 | how much individuals differ from the mean (sd added per item and person) |
| `--segment-effects` | none | JSON `{"S1": {"O1": {"I11": 1.2}}}`: utility shift for an option's respondents |
| `--speeders` | 0.05 | share of respondents who click randomly and fast |

Also writes `<out>.truth.json` with the settings used.

## How a fake respondent answers

1. Gets a random version; screen order and item order are shuffled like the survey page.
2. Personal utilities = true utility + random personal noise + segment shifts.
3. Best is drawn with probability ∝ e^u among the screen's items; worst with probability ∝ e^−u among the rest. This is the same model the analysis fits.
4. Speeders pick at random in 0.6–1.5 s per screen; the quality flags should catch them.

## Demo files

- `design/studies/restaurant-demo.true-utils.json`: food quality and price on top, loyalty perks at the bottom.
- `design/studies/restaurant-demo.segment-effects.json`: frequent diners (O1) care more about drinks (I11) and atmosphere (I08); rare diners (O3) more about price (I02) and portions (I12).

Note: estimated utilities come out somewhat smaller than the true ones, because personal noise flattens the average choice pattern. The ranking is what the test checks.
