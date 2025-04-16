document.addEventListener("DOMContentLoaded", () => {
    const timelineContainer = document.querySelector(".timeline-container");
    const timelineDot = document.getElementById("timeline-dot");
    const timelineYear = document.getElementById("timeline-year");
    const timelineItems = document.querySelectorAll(".timeline-item");

    if (
        !timelineContainer ||
        !timelineDot ||
        !timelineYear ||
        timelineItems.length === 0
    ) {
        console.error("Timeline elements not found.");
        return;
    }

    const dotHeight = timelineDot.offsetHeight;
    const halfDotHeight = dotHeight / 2;
    let indicatorsVisible = false;

    const observerOptions = {
        root: timelineContainer,
        rootMargin: "-40% 0px -60% 0px",
        threshold: 0,
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const year = entry.target.getAttribute("data-year");
                if (year) {
                    timelineYear.textContent = year;
                }
            }
        });
    };

    const observer = new IntersectionObserver(
        observerCallback,
        observerOptions
    );

    timelineItems.forEach((item) => {
        observer.observe(item);
    });

    const handleScroll = () => {
        const containerHeight = timelineContainer.offsetHeight;
        const scrollableHeight =
            timelineContainer.scrollHeight - containerHeight;
        const scrollTop = timelineContainer.scrollTop;

        if (scrollableHeight <= 0) {
            timelineDot.style.top = `${halfDotHeight}px`;
            timelineYear.style.top = `${halfDotHeight}px`;
            return;
        }

        const scrollPercent = scrollTop / scrollableHeight;

        const travelDistance = containerHeight - dotHeight;

        const dotTopOffset = scrollPercent * travelDistance;

        const dotTop = dotTopOffset;

        const yearTop = dotTopOffset + halfDotHeight;

        timelineDot.style.top = `${dotTop}px`;
        timelineYear.style.top = `${yearTop}px`;

        if (!indicatorsVisible) {
            timelineDot.classList.add("visible");
            timelineYear.classList.add("visible");
            indicatorsVisible = true;
        }
    };

    timelineContainer.addEventListener("scroll", handleScroll);

    handleScroll();

    setTimeout(() => {
        const firstVisible = Array.from(timelineItems).find((item) => {
            const rect = item.getBoundingClientRect();
            return rect.top >= 0 && rect.top <= window.innerHeight * 0.6;
        });
        if (firstVisible) {
            const year = firstVisible.getAttribute("data-year");
            if (year) {
                timelineYear.textContent = year;
                if (!indicatorsVisible) {
                    timelineDot.classList.add("visible");
                    timelineYear.classList.add("visible");
                    indicatorsVisible = true;
                }
            }
        } else if (!indicatorsVisible) {
        }
    }, 100);

    const scrollToTopButton = document.getElementById("back-to-top-button");
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener("click", () => {
            timelineContainer.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }
});
