const ID_LIST_BELUM = "listBelum";
const ID_LIST_SUDAH = "listSudah";
const ID_BUKU = "idBuku";

function buatListBaca(judulB, penulisB, tahunB, selesai) {
    const judulBuku = document.createElement("h3");
    const judul = document.createElement("span");
    judul.classList.add("judul_buku");
    judul.innerText = judulB;
    judulBuku.append(judul);

    const penulisBuku = document.createElement("p");
    penulisBuku.innerText = "Penulis : ";
    const penulis = document.createElement("span");
    penulis.classList.add("penulis_buku");
    penulis.innerText = penulisB;
    penulisBuku.append(penulis);

    const tahunBuku = document.createElement("p");
    tahunBuku.innerText = "Tahun Terbit : ";
    const tahun = document.createElement("span");
    tahun.classList.add("tahun_buku");
    tahun.innerText = tahunB;
    tahunBuku.append(tahun);

 

    const infoBuku = document.createElement("div");
    infoBuku.classList.add("info");
    infoBuku.append(judulBuku, penulisBuku, tahunBuku);

    const aksiBuku = document.createElement("div");
    aksiBuku.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(infoBuku, aksiBuku);

    if (selesai) {
        aksiBuku.append(
            
            buatTombolUndo(),
            buatTombolSampah()
        );
    } else {
        aksiBuku.append(buatTombolCek(), buatTombolSampah());
    }

    return container;
}

function tambahBuku() {
    const listBelumBaca = document.getElementById(ID_LIST_BELUM);
    const listSudahBaca = document.getElementById(ID_LIST_SUDAH);
    const checkType = document.getElementById("inputBukuSelesai");

    const judul = document.getElementById("inputJudul").value;
    const penulis = document.getElementById("inputPenulis").value;
    const tahun = document.getElementById("inputTahun").value;
   
    if (!checkType.checked) {
        const listBaca = buatListBaca(judul, penulis, tahun, false);
        const objekBuku = buatObjekBuku(judul, penulis, tahun, false);
        listBaca[ID_BUKU] = objekBuku.id;
        list.push(objekBuku);
        listBelumBaca.append(listBaca);
    } else {
        const listBaca = buatListBaca(judul, penulis, tahun, true);
        const objekBuku = buatObjekBuku(judul, penulis, tahun, true);
        listBaca[ID_BUKU] = objekBuku.id;
        list.push(objekBuku);
        listSudahBaca.append(listBaca);
    }
    updateDataToStorage();
}

function hapusForm() {
    document.getElementById("inputJudul").value = "";
    document.getElementById("inputPenulis").value = "";
    document.getElementById("inputTahun").value = "";
   
    document.getElementById("inputBukuSelesai").checked = false;
}

function buatTombol(buttonTypeClass, eventListener) {
    const tombol = document.createElement("button");
    tombol.classList.add(buttonTypeClass);
    tombol.addEventListener("click", function(event) {
        eventListener(event);
    });
    return tombol;
}

function tambahBukuSelesai(elemenBuku) {
    const judulBuku = elemenBuku.querySelector(".judul_buku").innerText;
    const penulisBuku = elemenBuku.querySelector(".penulis_buku").innerText;
    const tahunBuku = elemenBuku.querySelector(".tahun_buku").innerText;
   

    const bukuBaru = buatListBaca(judulBuku, penulisBuku, tahunBuku, true);
    const listSelesai = document.getElementById(ID_LIST_SUDAH);
    const book = cariBuku(elemenBuku[ID_BUKU]);
    book.selesai = true;
    bukuBaru[ID_BUKU] = book.id;
    listSelesai.append(bukuBaru);
    elemenBuku.remove();
    updateDataToStorage();
}

function buatTombolCek() {
    return buatTombol("checklist", function(event) {
        const parent = event.target.parentElement;
        tambahBukuSelesai(parent.parentElement);
    });
}

function hapusBukuSelesai(elemenBuku) {
    const posisiBuku = cariIndeksBuku(elemenBuku[ID_BUKU]);
    list.splice(posisiBuku, 1);
    elemenBuku.remove();
    updateDataToStorage();
}

function buatTombolSampah() {
    return buatTombol("trash", function(event) {
        const parent = event.target.parentElement;
        hapusBukuSelesai(parent.parentElement);
    });
}

function buatTombolUndo() {
    return buatTombol("undo", function(event) {
        const parent = event.target.parentElement;
        undoBukuSelesai(parent.parentElement);
    });
}



function undoBukuSelesai(elemenBuku) {
    const judulBuku = elemenBuku.querySelector(".judul_buku").innerText;
    const penulisBuku = elemenBuku.querySelector(".penulis_buku").innerText;
    const tahunBuku = elemenBuku.querySelector(".tahun_buku").innerText;
    

    const bukuBaru = buatListBaca(judulBuku, penulisBuku, tahunBuku, false);
    const listBelumBaca = document.getElementById(ID_LIST_BELUM);

    const book = cariBuku(elemenBuku[ID_BUKU]);
    book.selesai = false;
    bukuBaru[ID_BUKU] = book.id;
    listBelumBaca.append(bukuBaru);
    elemenBuku.remove();

    updateDataToStorage();
}



function tombolKembali() {
    document.getElementById("submitBuku").style.display = "block";
    
}




document.addEventListener("DOMContentLoaded", function() {

    const submitForm = document.getElementById("submitBuku");
    submitForm.addEventListener("click", function(event) {
        event.preventDefault();
        tambahBuku();
        hapusForm();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromList();
});

const checkType = document.getElementById("inputBukuSelesai");
checkType.addEventListener("click", () => {
    if (checkType.checked) {
        document.getElementById("tipeBuku").innerHTML = "<strong>Selesai Dibaca</strong>";
        document.getElementById("type").innerHTML = "<strong>Selesai Dibaca</strong>";
    } else {
        document.getElementById("tipeBuku").innerHTML = "<strong>Belum Dibaca</strong>";
        
    }
});

const STORAGE_KEY = "READING_LIST";

let list = [];

function isStorageExist() /* boolean */ {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(list);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null)
        list = data;
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function buatObjekBuku(judul, penulis, tahun, selesai) {
    return {
        id: +new Date(),
        judul,
        penulis,
        tahun,
        selesai
    };
}

function cariBuku(idBuku) {
    for (book of list) {
        if (book.id === idBuku)
            return book;
    }
    return null;
}

function cariIndeksBuku(idBuku) {
    let index = 0
    for (book of list) {
        if (book.id === idBuku)
            return index;

        index++;
    }

    return -1;
}

function refreshDataFromList() {
    const listBelumSelesai = document.getElementById(ID_LIST_BELUM);
    let listSelesai = document.getElementById(ID_LIST_SUDAH);
    for (book of list) {
        const bukuBaru = buatListBaca(book.judul, book.penulis, book.tahun, book.selesai);
        bukuBaru[ID_BUKU] = book.id;
        if (book.selesai) {
            listSelesai.append(bukuBaru);
        } else {
            listBelumSelesai.append(bukuBaru);
        }
    }
}