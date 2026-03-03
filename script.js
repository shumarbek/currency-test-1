class Currency {
    #code; //USD, EUR, RUBL
    #rate; //USD=1, EUR=0.81
    constructor(code, rate) {
        this.#code = code;
        this.#rate = rate;
    }
    get code() {
        return this.#code;

    }
    get rate() {
        return this.#rate;
    }
    display(container) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${this.#code}</td>
            <td>${this.#rate}</td>
        `;
        container.appendChild(tr);
    }
}

class CurrencyConverter {
    #currencies;

    constructor(currencies) {
        this.#currencies = currencies;
        this.#populateSelects('from-currency');
        this.#populateSelects('to-currency');
        
        // Default qiymatlarni o'rnatish
        setTimeout(() => {
            document.getElementById('from-currency').value = 'USD';
            document.getElementById('to-currency').value = 'EUR';
        }, 100);
        
        document.getElementById('convert').addEventListener('click', () => {
            this.#convert();
        });
    }

    #populateSelects(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = ''; // Tozalash
        this.#currencies.forEach(currency => {
            const option = document.createElement("option");
            option.value = currency.code;
            option.textContent = currency.code;
            selectElement.appendChild(option);
        }); 
    }

    #convert() {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        const amount = parseFloat(document.getElementById('amount').value) || 0;
        
        const fromRate = this.#currencies.find(c => c.code === fromCurrency).rate;
        const toRate = this.#currencies.find(c => c.code === toCurrency).rate;
        
        // USD asosiy valyuta (rate=1)
        const result = (amount / fromRate) * toRate;
        
        const resultElement = document.getElementById('result');
        resultElement.textContent = `Natija: ${result.toFixed(1)} ${toCurrency}`;
    }
}

class App {
    #list;
    #currencies;
    constructor() {
        this.#init();
    }
    async #init() {
        this.#list = document.getElementById("table-body");
        const response = await fetch("https://api.frankfurter.app/latest?from=USD");
        const result = await response.json();
        this.#transformResult(result);
    }
    #transformResult(result) {
        const { base, rates } = result;
        
        const baseCurrency = new Currency(base, 1); // USD rate = 1
        
        const otherCurrencies = Object.entries(rates).map(([code, rate]) => new Currency(code, rate));

        this.#currencies = [baseCurrency, ...otherCurrencies];
        this.#renderTable();
        
        // CurrencyConverter obyektini yaratish
        new CurrencyConverter(this.#currencies);
    }
    #renderTable() {
        this.#list.innerHTML = ''; // Tozalash
        this.#currencies.forEach(currency => currency.display(this.#list));
    }
}

// Appni ishga tushirish
new App();