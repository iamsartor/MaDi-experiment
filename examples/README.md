# Examples

| File | What |
| --- | --- |
| [restaurant-demo.html](restaurant-demo.html) | The restaurant demo study as one self-contained survey file, in **test mode**: it saves nothing and shows the record that would be stored at the end. Dummy content only. |

Live (GitHub Pages): https://iamsartor.github.io/MaDi-experiment/examples/restaurant-demo.html

Rebuild after changing the survey code or the demo study:

```bash
python design/build_html.py design/studies/restaurant-demo.items.json --mode test --out examples/restaurant-demo.html
```

Only dummy studies belong here: a built file contains the wording, and this repo is public.
