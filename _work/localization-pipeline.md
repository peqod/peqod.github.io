---
title: Brand systems at scale
role: Design Operations Lead
client: Canon, Ferrero Rocher, CAT via BBI Online / Lionbridge
year: 2017–2024
tools: Data-driven asset pipeline, Adobe Suite, 40+ language localization
outcome: "Pixel-perfect brand compliance across 40+ languages: and a pipeline that made turnaround 5× faster with no quality loss."
order: 4
status: published
created: 2026-06-26
---
![[o-SNAIL-FIGHTS-A-KNIGHT-3-900-620d2c593b10b__700.jpg]]
 *Agency work: client assets are not shown here. This is the process story, which is the interesting part anyway.*

Seven years directing visual output for **Canon, Ferrero Rocher, and CAT** across EMEA and global markets. The job sounds like design; the problem is logistics: multiple concurrent campaigns, each shipping in **40+ languages**, every version perfect against brand guidelines. 

## The bottleneck

24 episodes, 40+ languages.

Manual multi-language content delivery doesn't scale well. Especially if there are multiple non standard alphabets in use.  Every locale is a re-layout, every re-layout is a review cycle, and review cycles multiply by language count.

It was a very tight moment in general - Adobe dropped multi-core cpu rendering that year as well, moving to the Mercury GPU engine. This made a 4k 5min. animation render in brand new Media Encoder for 5hr instead of ~1hr. 

Tight deadline did not allow us to assembly a new machine in time. 
But the solution was outside of the pipeline this time.

## The fix

I designed and shipped a **data-driven asset pipeline** that standardised multi-language delivery: content and layout separated, locale variants generated from data using open source software. 

This was first time I've used blender3d extensively in production (it's 2017) - extensible nature of the platform allowed our team to devise a way to render all non Latin OST using multi threaded compositor rendering capabilities and some scripting magic to reverse the order of reading.

Result: **5× faster turnaround** with no quality loss: measured across campaigns that previously took the full manual cycle in a broken rendering pipeline.
