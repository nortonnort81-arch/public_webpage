# Katieeeeeeee — Anniversary Mini Game

A small, mobile-friendly anniversary experience made for Katieeeeeeee. The visitor answers nine randomized romantic questions and one fixed final question while a playful “NO” button tries to escape, then unlocks a surprise photo carousel.

## Run locally

No installation or build process is required. Open `index.html` directly, or serve the folder with any static web server.

For example, if PHP is installed:

```powershell
php -S localhost:8080
```

Then visit `http://localhost:8080`.

## Photo gallery

The final surprise contains 13 photos stored in `assets/images/gallery/`. The carousel supports automatic playback, previous/next controls, direct slide dots, and touch swipes.

## Customize the questions

Edit the question pool and fixed final question in `assets/js/questions.js`. Nine unique questions are selected randomly, and the fixed question is always shown as question 10.

## Publish with GitHub Pages

In the repository settings, open **Pages**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save. The site uses only HTML, CSS, and JavaScript, so it is fully compatible with GitHub Pages.
