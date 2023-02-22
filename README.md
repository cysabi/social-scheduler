# `social-scheduler`

> A self-hosted SPA that tries to make it easier to schedule events

![license][license-shield]
![stars][stars-shield]

This app depends on links to 2 ical files, one that represents "blocks" that people can select and claim, and a second "plans" calendar that represents blocks that have already been claimed.

- Show a list of avaliable blocks to claim.
- Create a url that redirects to google calendar, templated with the block / additional info provided. The user should send this to the host.

## usage <!-- Using the product -->

1. Fork the repo
2. Update the `src/config.js` with your name, and the 2 ical files.
   - `cal` is the "blocks" calendar
   - `plans` is the... plans calendar
3. Commit, and watch the magic happen!

## local setup <!-- Using the source -->

1. `npm i`
2. `npm run dev`
3. To build for production, run `npm run build`. There's already a workflow set up to automatically push to Github Pages.

---

[**@cerulepto**](https://github.com/LeptoFlare) • [lepto.tech](https://lepto.tech)

<!-- markdown links & imgs -->

[stars-shield]: https://img.shields.io/github/stars/LeptoFlare/social-scheduler.svg?style=social
[license-shield]: https://img.shields.io/github/license/LeptoFlare/social-scheduler.svg?style=flat
