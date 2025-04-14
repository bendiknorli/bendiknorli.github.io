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

    const dotHeight = timelineDot.offsetHeight; // Get dot height for offset calculation
    const halfDotHeight = dotHeight / 2;
    let indicatorsVisible = false;

    // --- Intersection Observer for Year Text Update ---
    const observerOptions = {
        root: timelineContainer, // Observe within the scrolling container
        rootMargin: "-40% 0px -60% 0px", // Trigger near the vertical center
        threshold: 0, // Trigger as soon as any part enters the margin
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

    // --- Scroll Listener for Dot/Year Position ---
    const handleScroll = () => {
        const containerHeight = timelineContainer.offsetHeight; // Viewport height effectively
        const scrollableHeight =
            timelineContainer.scrollHeight - containerHeight;
        const scrollTop = timelineContainer.scrollTop;

        if (scrollableHeight <= 0) {
            // No scrolling needed, position at middle or top? Let's default to top.
            timelineDot.style.top = `${halfDotHeight}px`;
            timelineYear.style.top = `${halfDotHeight}px`;
            return;
        }

        const scrollPercent = scrollTop / scrollableHeight; // Value between 0 and 1

        // Calculate the available travel distance for the dot's center
        const travelDistance = containerHeight - dotHeight;
        // Calculate the dot's top offset
        const dotTopOffset = scrollPercent * travelDistance;

        // Position the top of the dot
        const dotTop = dotTopOffset;
        // Position the year display (aligned with dot's center)
        const yearTop = dotTopOffset + halfDotHeight;

        timelineDot.style.top = `${dotTop}px`;
        timelineYear.style.top = `${yearTop}px`;

        // Make indicators visible on first scroll
        if (!indicatorsVisible) {
            timelineDot.classList.add("visible");
            timelineYear.classList.add("visible");
            indicatorsVisible = true;
        }
    };

    timelineContainer.addEventListener("scroll", handleScroll);

    // Initial call to position correctly on load if not scrolled to top
    handleScroll();
    // Also trigger observer check manually in case first item is already "intersecting"
    // but observer hasn't fired yet. A small delay helps.
    setTimeout(() => {
        const firstVisible = Array.from(timelineItems).find((item) => {
            const rect = item.getBoundingClientRect();
            return rect.top >= 0 && rect.top <= window.innerHeight * 0.6; // Check if roughly visible
        });
        if (firstVisible) {
            const year = firstVisible.getAttribute("data-year");
            if (year) {
                timelineYear.textContent = year;
                if (!indicatorsVisible) {
                    // Only make visible if scroll hasn't already
                    timelineDot.classList.add("visible");
                    timelineYear.classList.add("visible");
                    indicatorsVisible = true;
                }
            }
        } else if (!indicatorsVisible) {
            // If still nothing visible (e.g. empty timeline), maybe hide? Or show default?
            // For now, let scroll handle visibility.
        }
    }, 100);
});
