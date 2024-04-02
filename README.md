# `social-scheduler`
> A self-hosted SPA that tries to make it easier to schedule events

This app depends on links to 2 ical files, one that represents "blocks" that people can select and claim, and a second "plans" calendar that represents blocks that have already been claimed.

- Show a list of avaliable blocks to claim.
- Create a url that redirects to google calendar, templated with the block / additional info provided. The user should send this to the host.

## usage

1. Fork the repo
2. Go to `Settings` > `Pages` and set the source to `GitHub Actions`
3. Set the correct `base` in `vite.config.js`.
4. Update the `src/config.js` with your name, and the 2 ical files.
   - `cal` is the "blocks" calendar
   - `plans` is the... plans calendar
5. Commit, and watch the magic happen!

## local setup

1. `npm i`
2. `npm run dev`
3. To build for production, run `npm run build`. There's already a workflow set up to automatically push to Github Pages.

---

*empathy included • [**@cysabi**](https://github.com/cysabi) • [cysabi.github.io](https://cysabi.github.io)*
