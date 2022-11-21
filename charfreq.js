// Этот класс расширяет класс Map так, что метод get() возвращяет вместо null 
// указанное значение, когда ключ отсутсвует в отображении 

const { throws } = require("assert");

class DefaultMap extends Map {
    constructor(defaultValue) {
        super();                    // Конструктор супер класса
        this.defaultValue = defaultValue // Запомним стандартное значение 
    }

    get(key) {
        if (this.has(key)) {        // Если ключ присутсвует в отображении 
            return super.get(key)   // тогда возвращать его значение из суперкласса 
        }
        else {
            return this.defaultValue // Иначе возвратить дефолтное значение
        }
    }
}

class Histogram {
    constructor() {
        this.letterCounts = new DefaultMap(0);  // Отображение букв на счетчике 
        this.totalLetters = 0;                  // Общее кол-во букв 
    }

    // Эта функция обновляет гистограмму буквами текста 
    add(text) {
        // Удалить из текста пробельные символы 
        // И преобразовать оставшиеся в верхний регистр 
        text = text.replace(/\s/g,"").toUpperCase();

        // Пройти в цикле по символам 
        for (let character of text) {
            let count = this.letterCounts.get(character);
            
            this.letterCounts.set(character, count + 1); // Получить старый счетчик 
            this.totalLetters++;                         // Инкрементировать его
        }
    }
    //Преобразовывать гистограмму в строку, которая отображает графику ASCII
    toString() {

    // Преобразовать Map в массив массивов [Ключ, Значение]
        let entries = [...this.letterCounts]
    // Отсортировать массив по счетчику, а затем в алфавитном порядке 
    entries.sort((a, b) => {

        if (a[1] === b[1]) {                // Если счетчики одинаковые, тогда 
            return b[0] < b[0] ? -1 : 1;    // сортировать в алфавитном порядке
        } else {                            // Если счетчики отличаются, тогда
            return b[1] - a[1]              // сортировать по наибольшему счетчику 
        }  
    });

    // Преобразовать счетчик в процентные отношения
    for (let entry of entries) {
        entry[1] = entry[1] / this.totalLetters*100;
    }

    // Отбросить все записи с процентным отношением менее 1%
    entries = entries.filter(entry => entry[1] >= 1);

    // Преобразовать каждую запись в строку текста 
    let lines = entries.map(
        ([l,n]) => `${l} : ${"#".repeat(Math.round(n))} ${n.toFixed(2)}% `
    );

    // Возвращем сцепленные строки, разделенные символами новой строки 
    return lines.join("\n");
    }
}

async function histogramFromStdin() {
    process.stdin.setEncoding("utf-8")  // Читать строки Unicode, не байты 
    let histogram = new Histogram();
    for await (let chunk of process.stdin) {
        histogram.add(chunk);
    }
    return histogram;
}

histogramFromStdin().then(histogram => { console.log(histogram.toString()); })