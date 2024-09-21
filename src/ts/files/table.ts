const tables = document.querySelectorAll('.table-container');

if (tables.length > 0) {
    tables.forEach((tableContainer) => {
        const tableSelect = tableContainer.querySelector('.table-pagination__select') as HTMLSelectElement;
        const table = tableContainer.querySelector('.table') as HTMLTableElement;
        const rows = table ? Array.from(table.querySelectorAll('tbody tr')) : [];
        const current = tableContainer.querySelector('.table-pagination__current') as HTMLElement;
        const navPrev = tableContainer.querySelector('.table-pagination__button_prev') as HTMLButtonElement;
        const navNext = tableContainer.querySelector('.table-pagination__button_next') as HTMLButtonElement;

        if (!table || rows.length === 0 || !tableSelect || !current || !navPrev || !navNext) {
            return;
        }

        let startToShowRows = 1;
        let endToShowRows = 5;
        let pageIndex = 0;
        let pages = Math.ceil(rows.length / endToShowRows);

        // Initialize select options
        function initializeSelectOptions() {
            const optionsSet = new Set([5, 10, 20, rows.length]);
            optionsSet.forEach(option => {
                if (option <= rows.length) {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.toString();
                    optionElement.textContent = option.toString();
                    tableSelect.appendChild(optionElement);
                }
            });
        }

        // Hide all rows except the first 5
        function hideRows() {
            rows.forEach((row, index) => {
                if (index >= endToShowRows) {
                    row.style.display = 'none';
                } else {
                    row.style.display = '';
                }
            });
        }

        // Update rows visibility based on current pagination
        function updateRows() {
            const from = startToShowRows - 1;
            const to = endToShowRows;

            rows.forEach((row, index) => {
                if (index >= from && index < to) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });

            current.textContent = `${from + 1}-${to} из ${rows.length}`;
        }

        // Initialize
        function init() {
            initializeSelectOptions();
            hideRows();
            updateRows();

            navPrev.setAttribute("disabled", "true");
            navNext.disabled = rows.length <= endToShowRows;
        }

        // On select change
        tableSelect.addEventListener('change', () => {
            const selectedValue = Number(tableSelect.value);
            pages = Math.ceil(rows.length / selectedValue);
            pageIndex = 0;
            startToShowRows = 1;
            endToShowRows = selectedValue;

            navPrev.setAttribute('disabled', 'true');
            navNext.disabled = pages <= 1;

            updateRows();
        });

        // On click navigation
        navPrev.addEventListener('click', () => {
            if (pageIndex > 0) {
                pageIndex--;
                navNext.disabled = false;

                startToShowRows -= Number(tableSelect.value);
                endToShowRows -= Number(tableSelect.value);

                if (pageIndex === 0) {
                    navPrev.setAttribute('disabled', 'true');
                }

                updateRows();
            }
        });

        navNext.addEventListener('click', () => {
            if (pageIndex < pages - 1) {
                pageIndex++;
                navPrev.removeAttribute('disabled');

                startToShowRows += Number(tableSelect.value);
                endToShowRows += Number(tableSelect.value);

                if (pageIndex >= pages - 1) {
                    navNext.disabled = true;
                }

                updateRows();
            }
        });

        init();
    });
}