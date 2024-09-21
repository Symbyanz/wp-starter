// ---------- Global variables ----------

let unlock: boolean = true;

// ---------- Actions on Hash ----------

if (location.hash) {
    const hsh = decodeURIComponent(location.hash.replace('#', ''));
    if (document.querySelector('.popup_' + hsh)) {
        popupOpen(hsh);
    } else if (document.querySelector('#' + hsh)) {
        goTo(document.querySelector('#' + hsh), 500, 'easeOutQuad');
    }
}



const popupLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.popup-link');
const popups: NodeListOf<HTMLElement> = document.querySelectorAll('.popup');

popupLinks.forEach(el => {
    el.addEventListener('click', (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        if (unlock) {
            const href = el.getAttribute('href');
            if (href) {
                const item = href.replace('#', '');
                popupOpen(item);
            }
        }
    })
})

export function popupOpen(item: string): void {
    const activePopups: NodeListOf<HTMLElement> = document.querySelectorAll('.popup_active');
    if (activePopups.length > 0) {
        popupClose(null, false);
    }

    const currentPopup: HTMLElement | null = document.querySelector('.popup_' + item);

    if (currentPopup && unlock) {
        bodyLockAdd(500);
        currentPopup.classList.add('popup_active');
        history.pushState('', '', '#' + item);
    }
}

export function popupClose(item: HTMLElement | null, bodyUnlock: boolean = true): void {
    if (unlock) {
        if (!item) {
            if (popups) {
                popups.forEach(popup => {
                    popup.classList.remove('popup_active');
                });
            }
        } else {
            item.classList.remove('popup_active');
        }
        if (!document.querySelector('.mobile-sidebar_active') && bodyUnlock) {
            bodyLockRemove(500);
        }
        history.pushState('', '', window.location.href.split('#')[0]);
    }
}

export function popupToggle(newItem: string): void {
    const currentPopup: HTMLElement | null = document.querySelector('.popup_' + newItem);
    const activePopups: NodeListOf<HTMLElement> = document.querySelectorAll('.popup_active');

    if (activePopups.length > 0 && currentPopup) {
        activePopups.forEach(popup => {
            if (popup !== currentPopup) {
                popupClose(popup, false);
            }
        });
    }

    if (currentPopup && unlock) {
        currentPopup.classList.add('popup_active');
        history.pushState('', '', '#' + newItem);
    }
}

const popupCloseIcons: NodeListOf<HTMLElement> = document.querySelectorAll('.popup__close');

popupCloseIcons.forEach(el => {
    el.addEventListener('click', () => {
        const popup = el.closest('.popup') as HTMLElement | null;
        if (popup) {
            popupClose(popup);
        }
    })
})

popups.forEach(el => {
    el.addEventListener('click', (e: MouseEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        const isContainer = target.closest('.popup__content');
        if (!isContainer) popupClose(el);
    })
})

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Esc') popupClose(null);
})



// ---------- Body lock functions ----------

export function bodyLock(delay: number): void {
    const body: HTMLElement = document.querySelector('body');
    if (body.classList.contains('lock')) {
        bodyLockRemove(delay);
    } else {
        bodyLockAdd(delay);
    }
}

export function bodyLockRemove(delay: number): void {
    const body: HTMLElement = document.querySelector('body');
    if (unlock) {
        const lockPadding: NodeListOf<HTMLDivElement> = document.querySelectorAll(".lp");
        setTimeout(() => {
            lockPadding.forEach(el => {
                el.style.paddingRight = '0px';
            })
            body.style.paddingRight = '0px';
            body.classList.remove('lock');
        }, (delay));

        unlock = false;
        setTimeout(() => unlock = true, delay);
    }
}

export function bodyLockAdd(delay: number): void {
    const body: HTMLElement = document.querySelector('body');
    if (unlock) {
        const lockPadding: NodeListOf<HTMLElement> = document.querySelectorAll(".lp");
        const paddingRightVal: string = window.innerWidth - document.documentElement.clientWidth + 'px';

        lockPadding.forEach(el => el.style.paddingRight = paddingRightVal);

        body.style.paddingRight = paddingRightVal;
        body.classList.add('lock');

        unlock = false;
        setTimeout(() => unlock = true, delay);
    }
}



// ---------- Scroll functions ----------

export function goTo(target: HTMLElement | null, duration: number, easing: string): void {
    if (!target) return;

    const offsetTop = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = offsetTop - startPosition;
    let startTime: number | null = null;

    function animateScroll(timestamp: number) {
        if (!startTime) {
            startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = getEasingFunction(easing)(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (elapsed < duration) {
            requestAnimationFrame(animateScroll);
        }
    }

    function getEasingFunction(easing: string) {
        switch (easing) {
            case 'easeOutQuad':
                return (t: number) => t * (2 - t);
            case 'linear':
                return (t: number) => t;
            case 'easeInQuad':
                return (t: number) => t * t;
            default:
                return (t: number) => t;
        }
    }

    requestAnimationFrame(animateScroll);
}

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
    link.addEventListener('click', (e: MouseEvent | TouchEvent) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        goTo(targetElement, 800, 'easeOutQuad');
    });
});




// ---------- Sticky header ----------

const headerStickySection: HTMLElement = document.querySelector('.header-sticky-section');
const headerTopSection: HTMLElement = document.querySelector('.header-top-section');

if (headerStickySection && headerTopSection) {
    const headerTopHeight = headerTopSection.clientHeight;

    const toggleFixedClass = () => {
        if (window.scrollY > headerTopHeight) {
            headerStickySection.classList.add('header-sticky-section_is-fixed');
        } else {
            headerStickySection.classList.remove('header-sticky-section_is-fixed');
        }
    };
    toggleFixedClass();
    window.addEventListener('scroll', toggleFixedClass);
}



// ---------- Button up ----------

const btnScrollUp: HTMLButtonElement = document.querySelector('.btn-scroll-up');

if (btnScrollUp) {
    const toggleScrollUpButton = () => {
        if (window.scrollY > window.innerHeight) {
            btnScrollUp.classList.add('btn-scroll-up_active');
        } else {
            btnScrollUp.classList.remove('btn-scroll-up_active');
        }
    }
    toggleScrollUpButton();
    window.addEventListener('scroll', toggleScrollUpButton);
}



// ---------- Mobile menu ----------

const btnMenu: HTMLButtonElement = document.querySelector('.btn-mobile-menu');
const btnMenuClose: HTMLButtonElement = document.querySelector('.btn-close-mobile-menu');
const mobileMenu: HTMLElement = document.querySelector('.mobile-sidebar');
const mobileMenuContent: HTMLElement = document.querySelector('.mobile-sidebar__content');

if (btnMenu && mobileMenu && mobileMenuContent && btnMenuClose) {
    btnMenu.addEventListener('click', () => {
        mobileMenu.classList.add('mobile-sidebar_active');
        const activePopups: NodeListOf<HTMLElement> = document.querySelectorAll('.popup_active');
        if (activePopups.length > 0) {
            popupClose(null, false);
        }
        bodyLockAdd(500);
    });

    btnMenuClose.addEventListener('click', (event) => {
        mobileMenu.classList.remove('mobile-sidebar_active');
        bodyLockRemove(500);
    });

    mobileMenu.addEventListener('click', (event) => {
        if (event.target !== mobileMenuContent && !mobileMenuContent.contains(event.target as Node)) {
            mobileMenu.classList.remove('mobile-sidebar_active');
            bodyLockRemove(500);
        }
    });
}



// ---------- Spoiler ----------

const spoilers: NodeListOf<HTMLElement> = document.querySelectorAll('.spoiler');
spoilers.forEach(spoiler => {
    const spoilerButton: HTMLButtonElement = spoiler.querySelector('.spoiler__button');
    const spoilerContent: HTMLElement = spoiler.querySelector('.spoiler__content');

    if (spoilerButton && spoilerContent) {
        const computedStyle = window.getComputedStyle(spoilerContent);
        const hideHeight = computedStyle.maxHeight !== 'none' ? computedStyle.maxHeight : '0px';
        // change text spoiler__button
        const hasTextClass = spoilerButton.classList.contains('spoiler__button_text');
        const buttonText = hasTextClass ? spoilerButton.querySelector('.text') : null;

        spoilerButton.addEventListener('click', (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            spoiler.classList.toggle('spoiler_active');
            if (spoiler.classList.contains('spoiler_active')) {
                spoilerContent.style.maxHeight = `${spoilerContent.scrollHeight}px`;
                spoilerButton.setAttribute('aria-label', 'Скрыть спойлер');
                if (buttonText) {
                    buttonText.textContent = 'Свернуть';
                }
            } else {
                spoilerContent.style.maxHeight = hideHeight;
                spoilerButton.setAttribute('aria-label', 'Показать спойлер');
                if (buttonText) {
                    buttonText.textContent = 'Подробнее';
                }
            }
        });
    }
})



// ---------- Remover nbsp; ----------

function replaceNbspWithSpace() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 992) {
        const excerpts = document.querySelectorAll('.hero__title, .title, .article__excerpt, .article__title, .sidebar-related__link');
        excerpts.forEach((excerpt) => {
            excerpt.innerHTML = excerpt.innerHTML.replace(/\&nbsp;/g, ' ');
        });
        window.removeEventListener('resize', replaceNbspWithSpace);
    }
}

document.addEventListener('DOMContentLoaded', replaceNbspWithSpace);
window.addEventListener('resize', replaceNbspWithSpace);



// ---------- Search panel ----------

const btnSearch = document.querySelector('.btn-search');
const searchPanel = document.querySelector('.search-panel') as HTMLElement;

if (btnSearch && searchPanel) {
    const toggleSearchPanel = (event: MouseEvent | TouchEvent) => {
        if (searchPanel.classList.contains('search-panel_active') && event.target !== btnSearch && !searchPanel.contains(event.target as Node)) {
            searchPanel.classList.remove('search-panel_active');
            document.removeEventListener('click', toggleSearchPanel);
        }
    };

    btnSearch.addEventListener('click', (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        if (!searchPanel.classList.contains('search-panel_active')) {
            searchPanel.classList.add('search-panel_active');

            setTimeout(() => {
                document.addEventListener('click', toggleSearchPanel);
            }, 0);
            setTimeout(() => {
                searchPanel.querySelector('input').focus();
            }, 200);
        } else {
            searchPanel.classList.remove('search-panel_active');
            document.removeEventListener('click', toggleSearchPanel);
        }
    });

    searchPanel.addEventListener('click', (event: MouseEvent | TouchEvent) => {
        event.stopPropagation();
    });
}


// ---------- Replacer breadcrumbs long links ----------
const breadcrumbLinks = document.querySelectorAll('.breadcrumbs__link');
breadcrumbLinks.forEach(function (link) {
    const textContent = link.textContent;
    if (textContent) {
        const words = textContent.split(' ');
        if (words.length > 9) {
            link.textContent = words.slice(0, 9).join(' ') + '...';
        }
    }
});




// ---------- Comment reply ----------
const commentAnchors: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.comment-reply-link');
const commentHiddenInput = document.querySelector<HTMLInputElement>('#comment_parent');
if (commentHiddenInput) {
    commentAnchors.forEach((anchor) => {
        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const target = e.currentTarget as HTMLAnchorElement;
            const commentId = target.getAttribute('data-commentid');
            if (commentId) {
                commentHiddenInput.value = commentId;
            }
        })
    })
}





// ---------- Print page ----------

const printPageButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.print-page');
if (printPageButtons) {
    printPageButtons.forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', (e: Event) => {
            e.preventDefault();
            window.print();
        })
    })
}



// ---------- Accordion ----------

const accordions: NodeListOf<HTMLElement> = document.querySelectorAll('.accordion__button');

if (accordions.length) {
    accordions.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.accordion__item') as HTMLElement;
            const panel = item.querySelector('.accordion__panel') as HTMLElement;
            const isActive = item.classList.contains('accordion__item_active');
            const height = panel.scrollHeight;

            item.classList.toggle('accordion__item_active', !isActive);
            panel.style.height = isActive ? '0' : `${height}px`;
        });

        button.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}



// ---------- Debounce ----------

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | undefined;

    return function (...args: Parameters<T>): void {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}