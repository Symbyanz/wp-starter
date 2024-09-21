declare const centerecoParams: {
    nonce: string;
    ajaxUrl: string;
};

import IMask from '../libs/imask'
import { goTo, popupClose, bodyLockRemove } from './functions';

// types
type formElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// form validation
const forms: NodeListOf<HTMLFormElement> = document.querySelectorAll('.form._validate'); // only custom form by class form
forms.forEach(form => form.addEventListener('submit', formSubmit));

async function formSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const button = e.target as HTMLButtonElement;
    const form = button.closest('form') as HTMLFormElement;
    const error = formValidate(form);
    const defaultErrorTitle = 'Ошибка отправки';
    const defaultErrorMessage = 'Произошла ошибка при отправке формы. Попробуйте еще раз.';
    if (!error) {
        try {
            const response = await formSend(form);
            const result = await response.json();
            formClean(form);
            popupClose(null, false);
            bodyLockRemove(500);

            if (response.ok) {
                if (result.success) {
                    showAlert(result.data.title, result.data.message, 'success');
                } else {
                    showAlert(result.data.title || defaultErrorTitle, result.data.message || defaultErrorMessage, 'error');
                }
            } else {
                showAlert(result.data.title || defaultErrorTitle, result.data.message || defaultErrorMessage, 'error');
            }
        } catch (error) {
            showAlert(defaultErrorTitle, defaultErrorMessage, 'error');
        }

        // Устанавливаем значение скрытого поля submitted в true
        const submittedField = form.querySelector('input[name="submitted"]') as HTMLInputElement;
        if (submittedField) {
            submittedField.value = 'true';
        }
        return;
    }

    const formError: NodeListOf<HTMLElement> | 0 = form.querySelectorAll('.form__error');
    if (formError && form.classList.contains('scroll-to-error')) {
        goTo(formError[0], 1000, 'easeOutQuad');
    }
}

function formValidate(form: HTMLFormElement): number {
    let errors = 0;
    let requiredFields: NodeListOf<formElement> = form.querySelectorAll('input._required, textarea._required, select._required');

    requiredFields.forEach(field => {
        if (!field.hasAttribute('hidden')) {
            let fieldIsValid: boolean = true;

            switch (field.tagName.toLowerCase()) {
                case 'input':
                    fieldIsValid = formValidateInput(field as HTMLInputElement);
                    break;
                case 'textarea':
                    fieldIsValid = formValidateTextarea(field as HTMLTextAreaElement);
                    break;
                case 'select':
                    fieldIsValid = formValidateSelect(field as HTMLSelectElement);
                    break;
            }

            if (!fieldIsValid) errors++;
        }
    })

    return errors;
}

function formAddError(field: formElement): void {
    field.classList.add('error');
    const parentField = field.closest('.form__field');
    parentField.classList.add('form__field_error');

    let fieldError: HTMLElement | null = parentField.querySelector('.form__error');
    if (fieldError) {
        parentField.removeChild(fieldError);
    }

    const fieldErrorText: string | null = field.getAttribute('data-error');
    if (fieldErrorText && fieldErrorText !== '') {
        fieldError = document.createElement('span');
        fieldError.classList.add('form__error');
        fieldError.textContent = fieldErrorText;
        parentField.appendChild(fieldError);

        // Add a class with a slight delay to start the animation
        setTimeout(() => {
            fieldError!.classList.add('form__error_visible');
        }, 0);
    }
}


function formRemoveError(field: formElement): void {
    field.classList.remove('error');
    const parentField = field.closest('.form__field');
    parentField.classList.remove('form__field_error');

    const fieldError = parentField.querySelector('.form__error');
    if (fieldError) {
        parentField.removeChild(fieldError);
    }
}

function formClean(form: HTMLFormElement): void {
    const fields: NodeListOf<HTMLInputElement | HTMLTextAreaElement> = form.querySelectorAll('input:not([type=hidden],[type=submit]),textarea');
    fields.forEach(field => {
        field.parentElement.classList.remove('form__field_focus');
        field.classList.remove('focus');
        field.value = field.getAttribute('data-value');
    })

    const checkboxes: NodeListOf<HTMLInputElement> = form.querySelectorAll('.checkbox__input');
    checkboxes.forEach(checkbox => {
        if (!checkbox.classList.contains('_required')) {
            checkbox.checked = false;
        }
    })

    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.value = '';
    })

    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
    })
}


// input validation

function formValidateInput(input: HTMLInputElement): boolean {
    let inputIsValid: boolean = true;
    const inputClassList: DOMTokenList = input.classList;

    if (inputClassList.contains('_email')) {
        inputIsValid = validateEmail(input);
    } else if (inputClassList.contains('_tel')) {
        inputIsValid = validateTel(input);
    } else if (inputClassList.contains('_inn')) {
        inputIsValid = validateInn(input);
    } else if (inputClassList.contains('_kpp')) {
        inputIsValid = validateKpp(input);
    } else if (inputClassList.contains('_rs')) {
        inputIsValid = validateRs(input);
    } else if (inputClassList.contains('_ks')) {
        inputIsValid = validateKs(input);
    } else if (inputClassList.contains('_bik')) {
        inputIsValid = validateBik(input);
    } else if (input.type === 'checkbox') {
        inputIsValid = validateCheckbox(input);
    } else {
        inputIsValid = input.value.trim() !== '';
    }

    if (inputIsValid) {
        formRemoveError(input);
    } else {
        formAddError(input);
    }

    return inputIsValid;
}

function validateEmail(input: formElement): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const inputValue = input.value.trim();
    return emailPattern.test(inputValue);
}

function validateTel(input: formElement): boolean {
    const phonePattern = /^\+7\s\d{3}\s\d{3}-\d{2}-\d{2}$/;
    const inputValue = input.value.trim();
    return phonePattern.test(inputValue);
}

function validateInn(input: formElement): boolean {
    const innPattern = /^\d{10}$|^\d{12}$/;
    const inputValue = input.value.trim();
    return innPattern.test(inputValue);
}

function validateKpp(input: formElement): boolean {
    const kppPattern = /^\d{9}$/;
    const inputValue = input.value.trim();
    return kppPattern.test(inputValue);
}

function validateRs(input: formElement): boolean {
    const rsPattern = /^\d{20}$/;
    const inputValue = input.value.trim();
    return rsPattern.test(inputValue);
}

function validateKs(input: formElement): boolean {
    const ksPattern = /^\d{20}$/;
    const inputValue = input.value.trim();
    return ksPattern.test(inputValue);
}

function validateBik(input: formElement): boolean {
    const bikPattern = /^\d{9}$/;
    const inputValue = input.value.trim();
    return bikPattern.test(inputValue);
}


function validateCheckbox(input: HTMLInputElement): boolean {
    return input.checked;
}


// textarea validation
function formValidateTextarea(textarea: HTMLTextAreaElement): boolean {
    let textareaIsValid: boolean = true;
    let errorMessage: string | null = null;

    const forbiddenPattern = /[<>]/g;
    const textareaValue = textarea.value.trim();

    if (textareaValue.length < 5) {
        errorMessage = 'Поле должно содержать более 5 символов';
        textareaIsValid = false;
    } else if (forbiddenPattern.test(textareaValue)) {
        errorMessage = 'Поле содержит запрещенные символы';
        textareaIsValid = false;
    } else {
        // Проверка на XSS-атаки
        const div = document.createElement('div');
        div.innerHTML = textareaValue;
        if (div.innerHTML !== textareaValue) {
            errorMessage = 'Поле не должно содержать HTML-теги';
            textareaIsValid = false;
        }
    }

    if (textareaIsValid) {
        formRemoveError(textarea);
    } else {
        textarea.dataset.error = errorMessage;
        formAddError(textarea);
    }
    return textareaIsValid;
}


// select validation

function formValidateSelect(select: HTMLSelectElement): boolean {
    return true;

}

// placeholders & inputmasks
const fields: NodeListOf<formElement> = document.querySelectorAll('input:not([type=hidden]),textarea');
fields.forEach((field: formElement) => {
    const defaultValue = field.getAttribute('data-value');
    if (defaultValue) fieldPlaceholderAdd(field, defaultValue);
    if (field.value !== '' && field.value !== defaultValue) fieldFocusAdd(field);

    field.addEventListener('focus', (e: FocusEvent) => {
        fieldFocusAdd(field);
        const classList = field.classList;

        if (classList.contains('_tel')) {
            IMask(field, { mask: '+{7} 000 000-00-00' });
        } else if (classList.contains('_inn')) {
            IMask(field, { mask: '0000000000[00]' });
        } else if (classList.contains('_kpp')) {
            IMask(field, { mask: '000000000' });
        } else if (classList.contains('_rs')) {
            IMask(field, { mask: '00000000000000000000' });
        } else if (classList.contains('_ks')) {
            IMask(field, { mask: '00000000000000000000' });
        } else if (classList.contains('_bik')) {
            IMask(field, { mask: '000000000' });
        }
    })

    field.addEventListener('blur', (e: FocusEvent) => {
        fieldFocusRemove(field);
    })
})

function fieldPlaceholderAdd(field: formElement, defaultValue: string | null): void {
    if (field.value === '' && defaultValue !== '') field.value = defaultValue;
}

function fieldFocusAdd(field: formElement): void {
    // if (field.classList.contains('error') && field.classList.contains('_required')) formRemoveError(field);
    field.classList.add('focus');
    field.closest('.form__field')?.classList.add('form__field_focus');
}

function fieldFocusRemove(field: formElement): void {
    field.classList.remove('focus');
    field.closest('.form__field')?.classList.remove('form__field_focus');
}


const passwordButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.icon-button-password');
passwordButtons.forEach(passwordButton => {
    passwordButton.addEventListener('click', (e: MouseEvent | TouchEvent) => {
        const passwordInput = passwordButton.parentElement.querySelector('input');
        const isPasswordOff = passwordButton.classList.toggle('icon-button-password_off');
        passwordInput.setAttribute("type", isPasswordOff ? 'text' : 'password');
    })
})


// sending forms
async function formSend(form: HTMLFormElement): Promise<Response> {
    const formData = new FormData(form);
    let endpoint = form.getAttribute('action') || centerecoParams.ajaxUrl;

    // for comments ajax
    if (form.id === 'commentform') {
        endpoint = centerecoParams.ajaxUrl;
        formData.append('action', 'submit_comment');
    } else {
        formData.append('action', 'handle_form');
    }

    formData.append('nonce', centerecoParams.nonce);

    return fetch(endpoint, {
        method: 'POST',
        body: formData
    })
}

// alert 
const alertQueue: { title: string, text: string, type: 'success' | 'error' }[] = [];
let isAlertActive = false;

function showAlert(title: string, text: string, type: 'success' | 'error'): void {
    alertQueue.push({ title, text, type });
    processAlertQueue();
}

function processAlertQueue(): void {
    if (isAlertActive || alertQueue.length === 0) {
        return;
    }

    const { title, text, type } = alertQueue.shift()!;
    createAlert(title, text, type);
}

function createAlert(title: string, text: string, type: 'success' | 'error'): void {
    isAlertActive = true;

    const alertContainer = document.createElement('div');
    const alertSuccessIcon = '<svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_198_693" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="33"><rect y="0.5" width="32" height="32"/></mask><g mask="url(#mask0_198_693)"><path d="M14.1334 22.6334L23.5334 13.2334L21.6667 11.3667L14.1334 18.9001L10.3334 15.1001L8.46675 16.9667L14.1334 22.6334ZM16.0001 29.8334C14.1556 29.8334 12.4223 29.4834 10.8001 28.7834C9.17786 28.0834 7.76675 27.1334 6.56675 25.9334C5.36675 24.7334 4.41675 23.3223 3.71675 21.7001C3.01675 20.0779 2.66675 18.3445 2.66675 16.5001C2.66675 14.6556 3.01675 12.9223 3.71675 11.3001C4.41675 9.67786 5.36675 8.26675 6.56675 7.06675C7.76675 5.86675 9.17786 4.91675 10.8001 4.21675C12.4223 3.51675 14.1556 3.16675 16.0001 3.16675C17.8445 3.16675 19.5779 3.51675 21.2001 4.21675C22.8223 4.91675 24.2334 5.86675 25.4334 7.06675C26.6334 8.26675 27.5834 9.67786 28.2834 11.3001C28.9834 12.9223 29.3334 14.6556 29.3334 16.5001C29.3334 18.3445 28.9834 20.0779 28.2834 21.7001C27.5834 23.3223 26.6334 24.7334 25.4334 25.9334C24.2334 27.1334 22.8223 28.0834 21.2001 28.7834C19.5779 29.4834 17.8445 29.8334 16.0001 29.8334Z"/></g></svg>';
    const alertErrorIcon = '<svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_198_750" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="33"><rect y="0.5" width="32" height="32" /></mask><g mask="url(#mask0_198_750)"><path d="M16 23.1666C16.3777 23.1666 16.6944 23.0388 16.95 22.7833C17.2055 22.5277 17.3333 22.2111 17.3333 21.8333C17.3333 21.4555 17.2055 21.1388 16.95 20.8833C16.6944 20.6277 16.3777 20.5 16 20.5C15.6222 20.5 15.3055 20.6277 15.05 20.8833C14.7944 21.1388 14.6666 21.4555 14.6666 21.8333C14.6666 22.2111 14.7944 22.5277 15.05 22.7833C15.3055 23.0388 15.6222 23.1666 16 23.1666ZM14.6666 17.8333H17.3333V9.83329H14.6666V17.8333ZM16 29.8333C14.1555 29.8333 12.4222 29.4833 10.8 28.7833C9.17774 28.0833 7.76663 27.1333 6.56663 25.9333C5.36663 24.7333 4.41663 23.3222 3.71663 21.7C3.01663 20.0777 2.66663 18.3444 2.66663 16.5C2.66663 14.6555 3.01663 12.9222 3.71663 11.3C4.41663 9.67774 5.36663 8.26663 6.56663 7.06663C7.76663 5.86663 9.17774 4.91663 10.8 4.21663C12.4222 3.51663 14.1555 3.16663 16 3.16663C17.8444 3.16663 19.5777 3.51663 21.2 4.21663C22.8222 4.91663 24.2333 5.86663 25.4333 7.06663C26.6333 8.26663 27.5833 9.67774 28.2833 11.3C28.9833 12.9222 29.3333 14.6555 29.3333 16.5C29.3333 18.3444 28.9833 20.0777 28.2833 21.7C27.5833 23.3222 26.6333 24.7333 25.4333 25.9333C24.2333 27.1333 22.8222 28.0833 21.2 28.7833C19.5777 29.4833 17.8444 29.8333 16 29.8333Z" /></g></svg>';
    const headerStickySectionContent = document.querySelector('.header-sticky-section__content');

    alertContainer.className = `alert alert_${type}`;
    alertContainer.innerHTML = `
            <div class="alert__content">
                <div class="alert__icon">
                    <span class="icon icon_lg">
                        ${type === 'success' ? alertSuccessIcon : alertErrorIcon}
                    </span>
                </div>
                <div class="alert__info">
                    <div class="alert__title">${title}</div>
                    <div class="alert__desc">${text}</div>
                </div>
                <button type="button" class="btn btn_icon btn_sm alert__close" aria-label="Закрыть уведомление">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_198_300" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                            <rect width="24" height="24" />
                        </mask>
                        <g mask="url(#mask0_198_300)">
                            <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" />
                        </g>
                    </svg>
                </button>
            </div>
        `;

    if (headerStickySectionContent) {
        headerStickySectionContent.appendChild(alertContainer);
        setTimeout(() => {
            alertContainer.classList.add('alert_active');
        }, 0);
    }

    const closeButton = alertContainer.querySelector('.alert__close') as HTMLElement;
    closeButton.addEventListener('click', () => {
        removeAlert(alertContainer);
    });

    setTimeout(() => {
        removeAlert(alertContainer);
    }, 5000);
}

function removeAlert(alert: HTMLElement): void {
    alert.classList.remove('alert_active');
    setTimeout(() => {
        alert.remove();
        isAlertActive = false;
        processAlertQueue();
    }, 500);
}

// showAlert('Success!', 'The form was submitted successfully.', 'success');
// showAlert('Error!', 'There was an error submitting the form.', 'error');
// showAlert('Warning!', 'This is a warning message.', 'error');


const sliders = document.querySelectorAll<HTMLInputElement>('input[type="range"].range__slider');
sliders.forEach(slider => {
    const ticksContainer = slider.nextElementSibling;
    const ticks = ticksContainer?.querySelectorAll<HTMLSpanElement>('.range__span');

    const updateActiveTick = (value: number) => {
        ticks.forEach((tick, index) => {
            if (index + 1 === value) {
                tick.classList.add('range__span_active');
            } else {
                tick.classList.remove('range__span_active');
            }
        });
    };

    slider.style.setProperty('--value', slider.value);
    slider.style.setProperty('--min', slider.min === '' ? '1' : slider.min);
    slider.style.setProperty('--max', slider.max === '' ? '4' : slider.max);

    updateActiveTick(Number(slider.value));

    slider.addEventListener('input', () => {
        const value = Number(slider.value);
        slider.style.setProperty('--value', slider.value);
        updateActiveTick(value);
    });
})