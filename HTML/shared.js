/* Catalog prices remain numeric; formatting is only for display. */
window.Coffee = (() => {
  const products = [
    ['Iced Macchiato',35000,'iced machiatto.png','iced','Espresso, susu, dan sentuhan karamel. Disajikan dingin.'],
    ['Iced Americano',22000,'iced americano.png','iced','Espresso dengan air dan es untuk rasa kopi yang ringan dan segar.'],
    ['Iced Cappuccino',31000,'iced cappuccino.png','iced','Perpaduan espresso dan susu yang lembut, disajikan dengan es.'],
    ['Frappe',35000,'frappe.png','iced','Minuman kopi blended yang dingin, creamy, dan menyegarkan.'],
    ['Hot Cappuccino',29000,'hot cappuccino.png','hot','Espresso hangat dengan susu dan lapisan foam yang lembut.'],
    ['Hot Americano',22000,'hot americano.png','hot','Espresso dan air panas untuk menikmati karakter kopi yang klasik.'],
    ['Hot Macchiato',33000,'hot machiatto.png','hot','Espresso hangat dengan sentuhan susu untuk rasa yang seimbang.'],
    ['Hot Espresso',19000,'hot espresso.png','hot','Kopi pekat dengan aroma kuat, untuk pencinta rasa espresso.'],
    ['Caramel Latte',39000,'caramel latte.png','latte','Espresso dan susu lembut dengan rasa karamel.'],
    ['Cafe Latte',25000,'cafe latte.png','latte','Kombinasi klasik espresso dan susu yang creamy.'],
    ['Mocha Latte',33000,'mocha latte.png','latte','Kopi, susu, dan cokelat dalam satu cangkir.'],
    ['Matcha Latte',39000,'macha latte.png','latte','Rasa khas matcha berpadu dengan susu yang lembut.'],
    ['Cheesecake',41000,'cheesecake.png','pastry','Kue keju yang lembut untuk menemani kopi favoritmu.'],
    ['Cookies',23000,'cookies.png','pastry','Kudapan manis untuk melengkapi waktu santaimu.'],
    ['Chocolate Cake',41000,'chocolate cake.png','pastry','Potongan kue dengan rasa cokelat yang kaya.'],
    ['Croissant',24000,'crossaint.png','pastry','Pastry berlapis yang cocok dinikmati bersama kopi.']
  ].map(([name,price,image,category,description]) => ({name,price,image:`Image/menu/${image}`,category,description}));
  const money = value => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]');
      if (!Array.isArray(saved)) return [];
      const cart = [];
      saved.forEach(item => {
        const product = products.find(p => p.name === item?.name);
        const quantity = item?.quantity === undefined ? 1 : item.quantity;
        if (!product || !Number.isInteger(quantity) || quantity < 1) return;
        const existing = cart.find(p => p.name === product.name);
        if (existing) existing.quantity = Math.min(99,existing.quantity + quantity);
        else cart.push({...product,quantity:Math.min(99,quantity)});
      });
      return cart;
    } catch { return []; }
  }
  function writeCart(cart) {
    try {
      localStorage.setItem('orders',JSON.stringify(cart.map(({name,quantity}) => ({name,quantity}))));
      updateBadge();
      return true;
    } catch {
      toast('Pesanan belum tersimpan. Izinkan penyimpanan browser lalu coba lagi.',true);
      return false;
    }
  }
  function updateBadge() {
    const count = readCart().reduce((sum,item) => sum + item.quantity,0);
    document.querySelectorAll('[data-cart-count]').forEach(el => {el.textContent=count;el.hidden=!count;});
  }
  let toastTimer;
  function toast(message,error=false) {
    const el=document.getElementById('siteToast');
    el.textContent=message;el.classList.toggle('is-error',error);el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(() => el.classList.remove('visible'),error ? 7000 : 4000);
  }
  function setupDialog(dialog) {
    dialog.addEventListener('click',event => {
      if(event.target !== dialog) return;
      const b=dialog.getBoundingClientRect();
      if(event.clientX<b.left || event.clientX>b.right || event.clientY<b.top || event.clientY>b.bottom) dialog.close();
    });
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click',() => dialog.close()));
    dialog.addEventListener('close',() => document.body.classList.remove('dialog-open'));
  }
  function openDialog(dialog) {dialog.showModal();document.body.classList.add('dialog-open');}
  document.addEventListener('DOMContentLoaded',() => {
    const nav=document.getElementById('mainNav'),toggle=document.getElementById('mobileMenuToggle');
    toggle.setAttribute('aria-label','Buka navigasi');toggle.setAttribute('aria-controls','mainNav');toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',() => toggle.setAttribute('aria-expanded',String(nav.classList.toggle('show'))));
    function closeNav(){nav.classList.remove('show');toggle.setAttribute('aria-expanded','false');}
    nav.querySelectorAll('a').forEach(link => {
      if(link.classList.contains('active')) link.setAttribute('aria-current','page');
      link.addEventListener('click',closeNav);
    });
    document.addEventListener('keydown',event => {if(event.key==='Escape') closeNav();});
    const badge=document.createElement('span');badge.className='cart-badge';badge.dataset.cartCount='';badge.hidden=true;
    nav.querySelector('a[href="orderPage.html"]').append(' ',badge);
    const notice=document.createElement('div');notice.id='siteToast';notice.className='site-toast';notice.setAttribute('role','status');document.body.append(notice);
    updateBadge();
  });
  window.addEventListener('storage',updateBadge);
  return {products,money,readCart,writeCart,toast,setupDialog,openDialog,total:cart => cart.reduce((sum,item) => sum + item.price*item.quantity,0)};
})();
