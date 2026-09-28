document.addEventListener('DOMContentLoaded',() => {
  const {products,money,readCart,writeCart,toast,setupDialog,openDialog}=Coffee;
  const dialog=document.getElementById('menuDialog');
  const quantityLabel=document.getElementById('menuQuantity'),minus=document.getElementById('quantityMinus'),plus=document.getElementById('quantityPlus');
  const limit=document.getElementById('menuLimit');
  let selected,quantity=1;
  setupDialog(dialog);
  function updateQuantity(){quantityLabel.value=quantity;document.getElementById('menuSubtotal').textContent=money(selected.price*quantity);minus.disabled=quantity<=1;plus.disabled=quantity>=99;}
  document.querySelectorAll('.category-btn').forEach(button => {
    button.setAttribute('aria-pressed',String(button.classList.contains('active')));
    button.addEventListener('click',() => {
      document.querySelectorAll('.category-btn').forEach(btn => {btn.classList.toggle('active',btn===button);btn.setAttribute('aria-pressed',String(btn===button));});
      document.querySelectorAll('.menu-section').forEach(section => {section.hidden=section.id!==button.dataset.category;section.style.display='';});
    });
  });
  document.querySelectorAll('.menu-item').forEach(card => {
    const product=products.find(p => p.name===card.querySelector('.item-name').textContent.trim());
    card.querySelector('.item-price').textContent=money(product.price);
    const button=document.createElement('button');button.type='button';button.className='select-menu';button.textContent='Pilih menu  +';button.setAttribute('aria-label',`Pilih ${product.name}`);card.append(button);
    button.addEventListener('click',() => {
      selected=product;quantity=1;
      document.getElementById('menuDialogTitle').textContent=product.name;
      const photo=document.getElementById('menuDialogPhoto');photo.src=product.image;photo.alt=product.name;
      document.getElementById('menuDescription').textContent=product.description;document.getElementById('menuPrice').textContent=money(product.price);
      updateQuantity();openDialog(dialog);
    });
  });
  minus.addEventListener('click',() => {quantity=Math.max(1,quantity-1);updateQuantity();});
  plus.addEventListener('click',() => {quantity=Math.min(99,quantity+1);updateQuantity();});
  document.getElementById('addToOrder').addEventListener('click',() => {
    const cart=readCart(),existing=cart.find(item => item.name===selected.name);
    if((existing?.quantity || 0)+quantity>99){limit.hidden=false;return;}
    if(existing) existing.quantity+=quantity;else cart.push({...selected,quantity});
    if(!writeCart(cart)){limit.textContent='Pesanan belum tersimpan. Izinkan penyimpanan browser lalu coba lagi.';limit.hidden=false;return;}
    dialog.close();toast(`${quantity} × ${selected.name} ditambahkan ke pesanan.`);
  });
  dialog.addEventListener('close',() => {limit.hidden=true;limit.textContent='Maksimal 99 untuk setiap menu dalam pesanan.';});
});
