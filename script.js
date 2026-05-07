/**
 * MANYBIRDS — site scripts
 */

(function () {
    "use strict";

    /** Sidebar and aggregated hub list order */
    const PROJECT_SLUGS = ["undersky", "birdworld", "flicker"];

    document.addEventListener("DOMContentLoaded", () => {
        initHomeVideo();
        initProjectsPage();
        initLightbox();
    });

    function initHomeVideo() {
        const wrap = document.querySelector(".home-video-bg");
        const video = document.getElementById("home-video");
        if (!wrap || !video) return;

        const showVideo = () => wrap.classList.add("has-video");

        video.addEventListener("loadeddata", showVideo);
        video.addEventListener("canplay", showVideo);
        video.addEventListener("error", () => wrap.classList.remove("has-video"));

        const tryPlay = video.play();
        if (tryPlay && typeof tryPlay.catch === "function") {
            tryPlay.catch(() => {});
        }
    }

    function initProjectsPage() {
        const stage = document.getElementById("project-stage");
        if (!stage) return;

        const hub = document.getElementById("project-hub");
        const hubList = document.getElementById("project-hub-list");
        const panels = stage.querySelectorAll(".project-panel");
        const buttons = document.querySelectorAll(".project-index button[data-project]");
        const backBtn = document.getElementById("project-index-back");

        if (!panels.length) return;

        function buildHubList() {
            if (!hubList) return;
            hubList.innerHTML = "";
            PROJECT_SLUGS.forEach((slug) => {
                const panel = document.getElementById(`panel-${slug}`);
                if (!panel) return;
                const title =
                    panel.querySelector(".project-panel-head h2")?.textContent?.trim() || slug;
                panel.querySelectorAll(".shows-list li").forEach((li) => {
                    const clone = li.cloneNode(true);
                    clone.append(document.createTextNode(" — "));
                    const projectLink = document.createElement("a");
                    projectLink.href = `#${slug}`;
                    projectLink.textContent = title;
                    clone.appendChild(projectLink);
                    hubList.appendChild(clone);
                });
            });
        }

        function slugFromHash() {
            const raw = (window.location.hash || "").replace(/^#/, "").toLowerCase();
            return PROJECT_SLUGS.includes(raw) ? raw : "";
        }

        function applySelection(slug) {
            const valid = PROJECT_SLUGS.includes(slug) ? slug : "";

            panels.forEach((panel) => {
                const on = valid && panel.dataset.project === valid;
                panel.classList.toggle("is-open", on);
            });

            if (hub) {
                if (valid) {
                    hub.classList.remove("is-open");
                } else {
                    hub.classList.add("is-open");
                }
            }

            buttons.forEach((btn) => {
                btn.classList.toggle("is-active", valid && btn.dataset.project === valid);
            });

            if (backBtn) {
                backBtn.hidden = !valid;
            }
        }

        buildHubList();

        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const slug = btn.dataset.project;
                if (!slug) return;
                if (window.location.hash === `#${slug}`) {
                    applySelection(slug);
                } else {
                    window.location.hash = slug;
                }
            });
        });

        window.addEventListener("hashchange", () => applySelection(slugFromHash()));

        if (backBtn) {
            backBtn.addEventListener("click", () => {
                const cleanUrl = window.location.href.replace(/#.*$/, "");
                try {
                    window.history.replaceState(null, "", cleanUrl);
                } catch {
                    try {
                        window.location.hash = "";
                    } catch {
                        /* ignore */
                    }
                }
                applySelection("");
            });
        }

        applySelection(slugFromHash());
    }

    function initLightbox() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxClose = document.getElementById("lightbox-close");
        const lightboxPrev = document.getElementById("lightbox-prev");
        const lightboxNext = document.getElementById("lightbox-next");

        if (!lightbox || !lightboxImg) return;

        let currentGallery = [];
        let currentIndex = 0;

        function showImage(index) {
            const img = currentGallery[index];
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || "";
        }

        function updateNavVisibility() {
            const single = currentGallery.length <= 1;
            if (lightboxPrev) lightboxPrev.style.display = single ? "none" : "";
            if (lightboxNext) lightboxNext.style.display = single ? "none" : "";
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
            updateNavVisibility();
        }

        function closeLightbox() {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
            lightboxImg.removeAttribute("src");
            currentGallery = [];
            currentIndex = 0;
        }

        function showPrev() {
            if (currentGallery.length <= 1) return;
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            showImage(currentIndex);
        }

        function showNext() {
            if (currentGallery.length <= 1) return;
            currentIndex = (currentIndex + 1) % currentGallery.length;
            showImage(currentIndex);
        }

        document.addEventListener("click", (e) => {
            const img = e.target.closest(".gallery-item img");
            if (!img) return;

            e.preventDefault();
            const gallery = img.closest(".gallery-grid");
            if (gallery) {
                currentGallery = Array.from(gallery.querySelectorAll(".gallery-item img"));
                currentIndex = Math.max(0, currentGallery.indexOf(img));
            } else {
                currentGallery = [img];
                currentIndex = 0;
            }
            openLightbox(currentIndex);
        });

        lightbox.addEventListener("click", closeLightbox);
        lightboxImg.addEventListener("click", (e) => e.stopPropagation());

        if (lightboxClose) {
            lightboxClose.addEventListener("click", (e) => {
                e.stopPropagation();
                closeLightbox();
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener("click", (e) => {
                e.stopPropagation();
                showPrev();
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener("click", (e) => {
                e.stopPropagation();
                showNext();
            });
        }

        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("active")) return;
            if (e.key === "Escape") closeLightbox();
            else if (e.key === "ArrowLeft") showPrev();
            else if (e.key === "ArrowRight") showNext();
        });
    }
})();
