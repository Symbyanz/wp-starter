const tabContainers: NodeListOf<HTMLDivElement> = document.querySelectorAll('.tabs');

tabContainers.forEach((container) => {
    const tabItems: NodeListOf<HTMLButtonElement> = container.querySelectorAll('.tabs__tab-item');
    const tabPanels: NodeListOf<HTMLDivElement> = container.querySelectorAll('.tabs__tab-panel');

    tabItems.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            activateTab(container, tab, index);
        });

        tab.addEventListener('keydown', (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    focusNextTab(tabItems, index);
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    focusPreviousTab(tabItems, index);
                    break;
                case 'Home':
                    event.preventDefault();
                    focusTab(tabItems, 0);
                    break;
                case 'End':
                    event.preventDefault();
                    focusTab(tabItems, tabItems.length - 1);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    activateTab(container, tab, index);
                    break;
            }
        });
    });

    tabPanels.forEach((panel, i) => {
        if (panel.classList.contains('tabs__tab-panel_active')) {
            panel.style.maxHeight = `${panel.scrollHeight + 200}px`;
        } else {
            panel.style.maxHeight = '0';
        }
    });

    function activateTab(container: HTMLDivElement, tab: HTMLButtonElement, index: number) {
        const tabItems = container.querySelectorAll<HTMLButtonElement>('.tabs__tab-item');
        const tabPanels = container.querySelectorAll<HTMLDivElement>('.tabs__tab-panel');

        tabItems.forEach((item, i) => {
            const isSelected = i === index;
            item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            item.classList.toggle('tabs__tab-item_active', isSelected);
            item.setAttribute('tabindex', isSelected ? '0' : '-1');
        });

        tabPanels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('tabs__tab-panel_active', isActive);
            if (isActive) {
                panel.style.maxHeight = `${panel.scrollHeight + 200}px`;
            } else {
                panel.style.maxHeight = '0';
            }
        });
    }

    function focusNextTab(tabItems: NodeListOf<HTMLButtonElement>, currentIndex: number) {
        const nextIndex = (currentIndex + 1) % tabItems.length;
        tabItems[nextIndex].focus();
    }

    function focusPreviousTab(tabItems: NodeListOf<HTMLButtonElement>, currentIndex: number) {
        const previousIndex = (currentIndex - 1 + tabItems.length) % tabItems.length;
        tabItems[previousIndex].focus();
    }

    function focusTab(tabItems: NodeListOf<HTMLButtonElement>, index: number) {
        tabItems[index].focus();
    }
});
