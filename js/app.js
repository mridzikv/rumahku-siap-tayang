(function(){
"use strict";

var PROFIL = {
  nama:       "Eni Trisnawati",
  peran:      "Guru dan pengembang media pembelajaran",
  institusi:  "SD Negeri 012/IX Pemunduran",
  surel:      "enitrisnawati09@guru.sd.belajar.id",
  foto:       "aset/foto-profil.webp",
  keterangan: ""
};
var PUSTAKA_TAMBAHAN = [
  ""
];
var KETERANGAN_ASET = "Ilustrasi oleh M. R. Varedho";

var A = 'aset/';

var RUANG = {
  halaman:  {j:"Halaman Depan", t:"Ini halaman depan rumahku. Ada pohon mangga yang rindang. Aku suka bermain di sini bersama teman-teman."},
  garasi:   {j:"Garasi",        t:"Ini garasi di kolong rumahku. Ayah menyimpan mobil, motor, dan sepedaku di sini."},
  tamu:     {j:"Ruang Tamu",    t:"Ini ruang tamu. Letaknya di depan. Kami menerima tamu di ruangan ini."},
  keluarga: {j:"Ruang Keluarga",t:"Ini ruang keluarga. Kami berkumpul dan menonton televisi bersama di sini."},
  dapur:    {j:"Dapur",         t:"Ini dapur. Ibu memasak dan menyimpan makanan di sini. Masakan ibu enak sekali."},
  makan:    {j:"Ruang Makan",   t:"Ini ruang makan. Setiap pagi dan malam kami makan bersama sambil berbagi cerita."},
  tidur:    {j:"Kamar Tidur",   t:"Ini kamar tidurku. Aku beristirahat dan belajar di sini. Kamarku harus selalu rapi."},
  mandi:    {j:"Kamar Mandi",   t:"Ini kamar mandi. Aku membersihkan badan di sini setiap hari."}
};
var JUM_RUANG = 8;

var RUMAH = [
  {f:"rumah-panggung", n:"Rumah Panggung", t:"Rumah Bina berdiri di atas tiang kayu. Kolongnya sejuk dan tidak mudah kebanjiran."},
  {f:"rumah-tembok",   n:"Rumah Tembok",   t:"Rumah Ayu menempel di tanah. Dindingnya dibuat dari batu bata."},
  {f:"rumah-susun",    n:"Rumah Susun",    t:"Rumah Doni bertingkat. Banyak keluarga tinggal di satu gedung yang sama."},
  {f:"rumah-adat",     n:"Rumah Adat",     t:"Ini rumah adat Jambi. Atapnya melengkung seperti perahu, diwariskan nenek moyang kita."}
];

var TUGAS = [
  {f:"tugas-sapu",    n:"Menyapu halaman"},
  {f:"tugas-piring",  n:"Mencuci piring"},
  {f:"tugas-kasur",   n:"Merapikan tempat tidur"},
  {f:"tugas-tanaman", n:"Menyiram tanaman"},
  {f:"tugas-sampah",  n:"Membuang sampah"},
  {f:"tugas-meja",    n:"Mengelap meja"}
];
var ORANG = [
  {f:"orang-ayah",  n:"Ayah"}, {f:"orang-ibu",   n:"Ibu"},
  {f:"orang-kakak", n:"Kakak"},{f:"orang-bina",  n:"Bina"}
];

var JAGA = [
  {f:"jaga-buang-sampah",     n:"Membuang sampah di tempatnya", ok:true},
  {f:"jaga-tutup-keran",      n:"Menutup keran setelah dipakai", ok:true},
  {f:"jaga-rapikan-mainan",   n:"Merapikan mainan setelah bermain", ok:true},
  {f:"jaga-sapu-lantai",      n:"Menyapu lantai rumah", ok:true},
  {f:"jaga-coret-dinding",    n:"Mencoret-coret dinding", ok:false},
  {f:"jaga-sampah-ke-sungai", n:"Membuang sampah ke sungai", ok:false}
];

var IKON = {
  "Dapur":"ikon-dapur", "Kamar Mandi":"ikon-mandi", "Ruang Tamu":"ikon-tamu",
  "Garasi":"ikon-garasi", "Ruang Makan":"ikon-makan", "Kamar Tidur":"ikon-tidur",
  "Halaman":"ikon-halaman", "Ruang Keluarga":"ikon-keluarga"
};

var SOAL = [
  {q:"Di mana ibu memasak?", p:["Dapur","Kamar Mandi","Ruang Tamu"], b:0},
  {q:"Ruangan untuk menerima tamu adalah?", p:["Garasi","Ruang Tamu","Dapur"], b:1},
  {q:"Di mana kita membersihkan badan?", p:["Ruang Makan","Halaman","Kamar Mandi"], b:2},
  {q:"Mobil dan sepeda disimpan di?", p:["Garasi","Kamar Tidur","Dapur"], b:0},
  {q:"Keluarga makan bersama di ruang?", p:["Kamar Mandi","Ruang Makan","Garasi"], b:1}
];

var JUDUL_SUB = ["Jelajahi rumah","Rumah berbeda","Bekerja sama","Menjaga rumah"];

var layar = 'sampul', sub = 0;
var sudahRuang = {}, jumlahRuang = 0;
var sudahRumah = {}, jumlahRumah = 0;
var tugasTerpilih = null, jumlahTugas = 0;
var jagaBenar = 0, jagaSelesai = false;
var soalKe = 0, skor = 0, soalTerkunci = false, evaluasiMulai = false;

var $  = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
function gbr(nama, alt){ return '<img src="'+A+nama+'.webp" alt="'+(alt||'')+'" loading="lazy">'; }

var kurangiGerak = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
var WARNA_BINTANG = ["bintang-kuning","bintang-daun","bintang-pink","bintang-biru","bintang-ungu"];
function taburBintang(x, y, n){
  if(kurangiGerak) return;
  n = n || 12;
  for(var i=0;i<n;i++){
    var s = document.createElement("span");
    s.className = "bintang " + WARNA_BINTANG[i % WARNA_BINTANG.length];
    s.textContent = "★";
    s.style.left = (x + (Math.random()*140 - 70)) + "px";
    s.style.top  = (y + (Math.random()*30 - 15)) + "px";
    s.style.fontSize = (20 + Math.random()*20) + "px";
    s.style.animationDelay = (Math.random()*0.18).toFixed(2) + "s";
    document.body.appendChild(s);
    (function(el){ setTimeout(function(){ el.remove(); }, 1400); })(s);
  }
}
function rayakan(el, n){
  if(!el) return;
  var r = el.getBoundingClientRect();
  taburBintang(r.left + r.width/2, r.top + r.height/2, n);
}
function ulangiGerak(el, nama, durasi){
  if(kurangiGerak || !el) return;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = nama + " " + durasi;
}

(function(){
  $("#profilNama").textContent = PROFIL.nama;
  $("#profilPeran").textContent = PROFIL.peran;
  $("#profilInstitusi").textContent = PROFIL.institusi;
  $("#profilSurel").textContent = PROFIL.surel;
  $("#profilKeterangan").textContent = PROFIL.keterangan;
  if(PROFIL.foto){
    var f = $("#profilFoto");
    f.textContent = "";
    var im = document.createElement("img");
    im.src = PROFIL.foto; im.alt = "Foto " + PROFIL.nama;
    f.appendChild(im);
  }
  $$("[data-layar='pustaka'] .rujukan .isian").forEach(function(el, i){
    if(PUSTAKA_TAMBAHAN[i]) el.textContent = PUSTAKA_TAMBAHAN[i];
  });
  var ket = $("#keteranganAset");
  if(ket) ket.textContent = KETERANGAN_ASET;
})();

$$(".zona").forEach(function(z){
  z.addEventListener("click", function(){
    var k = z.getAttribute("data-ruang");
    $$(".zona").forEach(function(x){ x.classList.remove("terpilih"); });
    z.classList.add("terpilih");
    if(!sudahRuang[k]){ sudahRuang[k] = true; jumlahRuang++; z.classList.add("sudah"); }
    $("#narasiJudul").textContent = RUANG[k].j;
    var p = $("#narasiTeks"); p.textContent = RUANG[k].t; p.classList.remove("kosong");
    var ik = $("#narasiIkon"), namaIkon = IKON[RUANG[k].j];
    if(ik && namaIkon){ ik.src = A + namaIkon + ".webp"; ik.hidden = false; ulangiGerak(ik, "buka-ruang", "320ms"); }
    $("#hitungRuang").textContent = jumlahRuang + " dari " + JUM_RUANG;
    if(jumlahRuang === JUM_RUANG) rayakan($("#hitungRuang"), 16);
    perbaruiNav();
  });
});

(function(){
  var w = $("#kisiRumah");
  RUMAH.forEach(function(r){
    var b = document.createElement("button");
    b.className = "kartu"; b.type = "button";
    b.innerHTML = gbr(r.f, r.n) + '<span class="label">'+r.n+'</span>';
    b.addEventListener("click", function(){
      $$("#kisiRumah .kartu").forEach(function(x){ x.classList.remove("terpilih"); });
      b.classList.add("terpilih");
      if(!sudahRumah[r.f]){ sudahRumah[r.f] = true; jumlahRumah++; }
      $("#rumahJudul").textContent = r.n;
      var p = $("#rumahTeks"); p.textContent = r.t; p.classList.remove("kosong");
      if(jumlahRumah === RUMAH.length){ $("#pesanKeberagaman").hidden = false; rayakan($("#pesanKeberagaman"), 16); }
      perbaruiNav();
    });
    w.appendChild(b);
  });
})();

(function(){
  var bt = $("#barisTugas"), bo = $("#barisOrang");
  TUGAS.forEach(function(t, i){
    var c = document.createElement("button");
    c.className = "kartu-tugas"; c.type = "button"; c.setAttribute("data-i", i);
    c.innerHTML = gbr(t.f, t.n) + '<span>'+t.n+'</span>';
    c.addEventListener("click", function(){
      $$("#barisTugas .kartu-tugas").forEach(function(x){ x.classList.remove("terpilih"); });
      if(tugasTerpilih === i){ tugasTerpilih = null; return; }
      tugasTerpilih = i; c.classList.add("terpilih");
      $$("#barisOrang .orang").forEach(function(x){ x.classList.add("siap"); });
      $("#pesanGotong").innerHTML = 'Sekarang ketuk siapa yang mengerjakan <b>'+t.n.toLowerCase()+'</b>.';
    });
    bt.appendChild(c);
  });
  ORANG.forEach(function(o){
    var b = document.createElement("button");
    b.className = "orang"; b.type = "button";
    b.innerHTML = gbr(o.f, o.n) + '<span class="nm">'+o.n+'</span><span class="tugasnya"></span>';
    b.addEventListener("click", function(){
      if(tugasTerpilih === null){
        $("#pesanGotong").textContent = "Pilih dulu satu pekerjaan di atas, ya."; return;
      }
      var t = TUGAS[tugasTerpilih];
      jumlahTugas++;
      var chip = $('#barisTugas .kartu-tugas[data-i="'+tugasTerpilih+'"]');
      chip.classList.remove("terpilih"); chip.classList.add("dipakai");
      tugasTerpilih = null;
      $$("#barisOrang .orang").forEach(function(x){ x.classList.remove("siap"); });
      var tag = document.createElement("b"); tag.textContent = t.n;
      b.querySelector(".tugasnya").appendChild(tag);
      if(jumlahTugas === TUGAS.length){
        $("#pesanGotong").textContent = "Semua pekerjaan sudah dibagi. Pekerjaan rumah jadi ringan kalau dikerjakan bersama-sama.";
        $("#pesanGotong").classList.add("hijau");
        rayakan($("#pesanGotong"), 16);
      }else{
        $("#pesanGotong").innerHTML = "Masih ada <b>"+(TUGAS.length - jumlahTugas)+"</b> pekerjaan yang belum dibagi.";
      }
      perbaruiNav();
    });
    bo.appendChild(b);
  });
})();

(function(){
  var w = $("#kisiJaga");
  var target = JAGA.filter(function(j){ return j.ok; }).length;
  JAGA.forEach(function(j){
    var b = document.createElement("button");
    b.className = "kartu"; b.type = "button";
    b.innerHTML = gbr(j.f, j.n) + '<span class="label">'+j.n+'</span>';
    b.addEventListener("click", function(){
      if(b.classList.contains("benar")) return;
      if(j.ok){
        b.classList.add("benar"); jagaBenar++;
        if(jagaBenar === target){
          jagaSelesai = true;
          $("#pesanJaga").textContent = "Bagus sekali. Menjaga rumah berarti menjaga lingkungan tempat tinggal kita.";
          $("#pesanJaga").classList.add("hijau");
          rayakan($("#pesanJaga"), 16);
        }else{
          $("#pesanJaga").textContent = "Bagus. Masih ada " + (target - jagaBenar) + " lagi.";
        }
      }else{
        b.classList.add("salah");
        setTimeout(function(){ b.classList.remove("salah"); }, 900);
        $("#pesanJaga").textContent = "Perbuatan itu merusak rumah dan lingkungan. Coba pilih yang lain.";
      }
      perbaruiNav();
    });
    w.appendChild(b);
  });
})();

function gambarSoal(){
  var s = SOAL[soalKe];
  soalTerkunci = false;
  $("#nomorSoal").textContent = String(soalKe + 1);
  $("#teksSoal").textContent = s.q;
  $("#pesanSoal").hidden = true; $("#pesanSoal").className = "pesan";
  var w = $("#kisiJawab"); w.innerHTML = "";
  s.p.forEach(function(nama, i){
    var b = document.createElement("button");
    b.className = "kartu"; b.type = "button";
    b.innerHTML = gbr(IKON[nama], nama) + '<span class="label">'+nama+'</span>';
    b.addEventListener("click", function(){
      if(soalTerkunci) return;
      soalTerkunci = true;
      if(i === s.b){
        b.classList.add("benar"); skor++;
        rayakan(b, 14);
        $("#pesanSoal").textContent = "Betul!"; $("#pesanSoal").classList.add("hijau");
      }else{
        b.classList.add("salah");
        $$("#kisiJawab .kartu")[s.b].classList.add("benar");
        $("#pesanSoal").textContent = "Jawaban yang tepat adalah " + s.p[s.b] + ".";
      }
      $("#pesanSoal").hidden = false;
      $$("#kisiJawab .kartu").forEach(function(x){
        if(!x.classList.contains("benar") && !x.classList.contains("salah")) x.classList.add("mati");
      });
      setTimeout(function(){
        soalKe++;
        if(soalKe < SOAL.length) gambarSoal(); else selesaikan();
      }, 1600);
    });
    w.appendChild(b);
  });
}
function mulaiEvaluasi(){
  soalKe = 0; skor = 0; evaluasiMulai = true; gambarSoal();
}
function selesaikan(){
  $("#skorAkhir").textContent = skor + " / " + SOAL.length;
  var pesan;
  if(skor === SOAL.length) pesan = "Hebat! Kamu hafal semua bagian rumah dan fungsinya.";
  else if(skor >= 3) pesan = "Bagus! Kamu sudah mengenal sebagian besar bagian rumah.";
  else pesan = "Tidak apa-apa. Ayo jelajahi rumah Bina sekali lagi.";
  $("#pesanAkhir").textContent = pesan;
  evaluasiMulai = false;
  keLayar("penutup");
  if(skor >= 3){
    var jum = (skor === SOAL.length) ? 30 : 18;
    setTimeout(function(){ rayakan($("#skorAkhir"), jum); }, 180);
  }
}
$("#tblUlang").addEventListener("click", function(){ keLayar("evaluasi"); });

function subSelesai(n){
  if(n === 0) return jumlahRuang >= JUM_RUANG;
  if(n === 1) return jumlahRumah >= RUMAH.length;
  if(n === 2) return jumlahTugas >= TUGAS.length;
  if(n === 3) return jagaSelesai;
  return true;
}
function pesanSyarat(n){
  if(n === 0) return "Ketuk semua bagian rumah dulu (" + jumlahRuang + " dari " + JUM_RUANG + ").";
  if(n === 1) return "Kenali keempat rumah dulu.";
  if(n === 2) return "Bagi semua pekerjaan dulu.";
  if(n === 3) return "Pilih semua perbuatan yang menjaga rumah.";
  return "";
}

var titik = $("#titikLangkah");
for(var i=0;i<4;i++) titik.appendChild(document.createElement("span"));

function perbaruiNav(){
  var maju = $("#tblMaju"), mundur = $("#tblMundur");
  var dot = $("#titikLangkah");

  if(layar === 'materi'){
    dot.hidden = false;
    $$("#titikLangkah span").forEach(function(s, i){
      s.className = i < sub ? "lewat" : (i === sub ? "kini" : "");
    });
    dot.setAttribute("aria-valuenow", String(sub + 1));
    mundur.hidden = false;
    mundur.textContent = (sub === 0) ? "Menu" : "Kembali";
    mundur.disabled = false;
    maju.hidden = false;
    maju.disabled = !subSelesai(sub);
    maju.textContent = (sub === 3) ? "Rangkuman" : "Lanjut";
    maju.title = maju.disabled ? pesanSyarat(sub) : "";
  }else{
    dot.hidden = true;
    if(layar === 'sampul'){
      mundur.hidden = true; maju.hidden = true;
    }else if(layar === 'menu'){
      mundur.hidden = false; mundur.textContent = "Sampul"; mundur.disabled = false;
      maju.hidden = true;
    }else if(layar === 'rangkuman'){
      mundur.hidden = false; mundur.textContent = "Menu"; mundur.disabled = false;
      maju.hidden = false; maju.disabled = false; maju.textContent = "Evaluasi"; maju.title = "";
    }else if(layar === 'evaluasi'){
      mundur.hidden = false; mundur.textContent = "Menu"; mundur.disabled = false;
      maju.hidden = true;
    }else{
      mundur.hidden = false; mundur.textContent = "Menu"; mundur.disabled = false;
      maju.hidden = true;
    }
  }
  $("#tblRumah").hidden = (layar === 'sampul' || layar === 'menu');
  maju.classList.toggle("siap-lanjut", !maju.hidden && !maju.disabled);
}

function keLayar(n, s){
  layar = n;
  if(s !== undefined) sub = s;
  $$("section[data-layar]").forEach(function(x){
    x.classList.toggle("aktif", x.getAttribute("data-layar") === layar);
  });
  $$("#materi [data-sub]").forEach(function(x, i){
    x.classList.toggle("aktif", i === sub);
  });
  if(layar === 'evaluasi' && !evaluasiMulai) mulaiEvaluasi();
  document.body.classList.toggle('di-sampul', n === 'sampul');
  document.querySelector("main").scrollTop = 0;
  perbaruiNav();
}

$("#tblMaju").addEventListener("click", function(){
  if(layar === 'materi'){
    if(!subSelesai(sub)) return;
    if(sub < 3) keLayar('materi', sub + 1); else keLayar('rangkuman');
  }else if(layar === 'rangkuman'){
    keLayar('evaluasi');
  }
});
$("#tblMundur").addEventListener("click", function(){
  if(layar === 'materi'){
    if(sub > 0) keLayar('materi', sub - 1); else keLayar('menu');
  }else if(layar === 'menu'){
    keLayar('sampul');
  }else{
    keLayar('menu');
  }
});
$("#tblRumah").addEventListener("click", function(){ keLayar('menu'); });
$$('[data-ke]').forEach(function(b){
  b.addEventListener("click", function(){
    var t = b.getAttribute("data-ke");
    if(t === 'materi') keLayar('materi', 0); else keLayar(t);
  });
});

perbaruiNav();
})();
