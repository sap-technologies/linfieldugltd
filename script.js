const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.getElementById("contactForm");

function closeNavigation() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("open");
    document.body.classList.remove("nav-open");
}

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        navMenu.classList.toggle("open", !isOpen);
        document.body.classList.toggle("nav-open", !isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });
}

const observedSections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && observedSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
                    link.classList.toggle("active", isCurrent);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
}

const revealTargets = [
    ".hero-copy",
    ".hero-panel",
    ".statement",
    ".positioning-note",
    ".value-card",
    ".service-category",
    ".service-reassurance",
    ".care-card",
    ".standard-card",
    ".objectives-strip span",
    ".process-list article",
    ".clients-grid span",
    ".contact-intro",
    ".contact-form",
    ".footer-main > *"
].flatMap((selector) => [...document.querySelectorAll(selector)]);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window && revealTargets.length > 0) {
    revealTargets.forEach((target, index) => {
        target.classList.add("reveal-item");
        target.style.setProperty("--reveal-delay", `${(index % 5) * 45}ms`);
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        },
        {
            rootMargin: "0px 0px -12% 0px",
            threshold: 0.12
        }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const contactMethod = String(formData.get("contact-method") || "").trim();

        if (!contactMethod) {
            alert("Please select a contact method.");
            return;
        }

        const details = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            location: String(formData.get("location") || "").trim(),
            service: String(formData.get("service") || "").trim(),
            preferredTime: String(formData.get("preferredTime") || "").trim(),
            message: String(formData.get("message") || "").trim()
        };

        const requiredFields = ["name", "email", "phone", "location", "service", "message"];

        if (requiredFields.some((field) => details[field].length === 0)) {
            alert("Please fill in the required fields before sending.");
            return;
        }

        const messageText = [
            "Hello Linfield Uganda, I would like to request a service.",
            "",
            `Name: ${details.name}`,
            `Email: ${details.email}`,
            `Phone: ${details.phone}`,
            `Location: ${details.location}`,
            `Service: ${details.service}`,
            details.preferredTime ? `Preferred contact time: ${details.preferredTime}` : null,
            "",
            `Message: ${details.message}`
        ].filter((line) => line !== null).join("\n");

        if (contactMethod === "whatsapp") {
            window.open(`https://wa.me/256781449714?text=${encodeURIComponent(messageText)}`, "_blank", "noopener");
        } else if (contactMethod === "email") {
            window.open(`mailto:linfiedug@gmail.com?subject=Service Request - ${encodeURIComponent(details.service)}&body=${encodeURIComponent(messageText)}`);
        }

        contactForm.reset();
    });
}

// Careers form handler
const careersForm = document.getElementById("careersForm");

if (careersForm) {
    careersForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(careersForm);
        const contactMethod = String(formData.get("contact-method") || "").trim();

        if (!contactMethod) {
            alert("Please select a contact method.");
            return;
        }

        const details = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            message: String(formData.get("message") || "").trim()
        };

        const requiredFields = ["name", "email", "phone", "message"];

        if (requiredFields.some((field) => details[field].length === 0)) {
            alert("Please fill in all required fields.");
            return;
        }

        const messageText = [
            "Hello Linfield Uganda, I am interested in joining your team.",
            "",
            `Name: ${details.name}`,
            `Email: ${details.email}`,
            `Phone: ${details.phone}`,
            "",
            `Message: ${details.message}`
        ].join("\n");

        if (contactMethod === "whatsapp") {
            window.open(`https://wa.me/256781449714?text=${encodeURIComponent(messageText)}`, "_blank", "noopener");
        } else if (contactMethod === "email") {
            window.open(`mailto:linfiedug@gmail.com?subject=Career Inquiry - ${encodeURIComponent(details.name)}&body=${encodeURIComponent(messageText)}`);
        }

        careersForm.reset();
    });
}

// Gallery filter handler
const galleryFilterSelect = document.getElementById("galleryFilter");
const galleryItems = [...document.querySelectorAll(".gallery-item")];

const galleryServiceGroups = {
    all: ["commercial", "residential", "upholstery", "electrical"],
    cleaning: ["commercial", "residential", "upholstery"],
    electrical: ["electrical"]
};

function updateGalleryDisplay(filterKey) {
    const activeServices = galleryServiceGroups[filterKey] || galleryServiceGroups.all;
    galleryItems.forEach((item) => {
        const service = item.dataset.service;
        item.hidden = !activeServices.includes(service);
    });
}

if (galleryFilterSelect) {
    galleryFilterSelect.addEventListener("change", (event) => {
        updateGalleryDisplay(event.currentTarget.value);
    });
    updateGalleryDisplay(galleryFilterSelect.value || "all");
}


// Back to top button handler
const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {
    window.addEventListener("scroll", () => {
        const isVisible = window.scrollY > 300;
        backToTopButton.classList.toggle("visible", isVisible);
    });

    backToTopButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
