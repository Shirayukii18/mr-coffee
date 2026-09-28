document.addEventListener('DOMContentLoaded', () => {
  const { money, readCart, writeCart, total, toast, setupDialog, openDialog } = Coffee;
  const form = document.getElementById('orderForm');
  const list = document.getElementById('orderListContainer');
  const confirmDialog = document.getElementById('confirmDialog');
  const successDialog = document.getElementById('successDialog');
  const confirmButton = document.getElementById('confirmOrder');
  const confirmError = document.getElementById('confirmError');
  let pending = null;
  setupDialog(confirmDialog);
  setupDialog(successDialog);

  function renderOrders(focusName, focusAction) {
    const cart = readCart();
    list.replaceChildren();
    document.getElementById('totalAmount').textContent = money(total(cart));
    form.querySelector('[type="submit"]').disabled = cart.length === 0;
    if (!cart.length) {
      list.innerHTML = '<div class="empty-cart"><span class="eyebrow">A cup is waiting for you</span><h3>Belum ada pilihan</h3><p>Temukan kopi atau pastry favoritmu dulu.</p><a class="primary-button" href="menuPage.html">Pilih menu &rarr;</a></div>';
      return;
    }
    cart.forEach(item => {
      const row = document.createElement('article');
      row.className = 'orderItem';
      // This template is static; product values are assigned with textContent.
      row.innerHTML = '<img alt=""><div><div class="order-item-top"><h3></h3><button class="btn-remove" type="button">Hapus</button></div><p class="order-item-price"></p><div class="order-item-bottom"><div class="quantity-control"><button type="button" data-action="minus">−</button><output></output><button type="button" data-action="plus">+</button></div><strong></strong></div></div>';
      row.querySelector('img').src = item.image;
      row.querySelector('img').alt = item.name;
      row.querySelector('h3').textContent = item.name;
      row.querySelector('.order-item-price').textContent = `${money(item.price)} / item`;
      row.querySelector('output').value = item.quantity;
      row.querySelector('output').setAttribute('aria-label', `Jumlah ${item.name}`);
      row.querySelector('strong').textContent = money(item.price * item.quantity);
      const minus = row.querySelector('[data-action="minus"]');
      const plus = row.querySelector('[data-action="plus"]');
      minus.setAttribute('aria-label', `Kurangi ${item.name}`);
      plus.setAttribute('aria-label', `Tambah ${item.name}`);
      minus.disabled = item.quantity <= 1;
      plus.disabled = item.quantity >= 99;
      [minus, plus].forEach(button => button.addEventListener('click', () => {
        const fresh = readCart();
        const target = fresh.find(product => product.name === item.name);
        if (!target) { renderOrders(); return; }
        target.quantity = Math.max(1, Math.min(99, target.quantity + (button === plus ? 1 : -1)));
        if (writeCart(fresh)) renderOrders(item.name, button.dataset.action);
      }));
      const remove = row.querySelector('.btn-remove');
      remove.setAttribute('aria-label', `Hapus ${item.name}`);
      remove.addEventListener('click', () => {
        if (writeCart(readCart().filter(product => product.name !== item.name))) {
          renderOrders();
          (list.querySelector('button') || list.querySelector('a'))?.focus();
          toast(`${item.name} dihapus dari pesanan.`);
        }
      });
      list.append(row);
      if (focusName === item.name) {
        const target = row.querySelector(`[data-action="${focusAction}"]`);
        (target.disabled ? row.querySelector(`[data-action="${focusAction === 'plus' ? 'minus' : 'plus'}"]`) : target).focus();
      }
    });
  }

  ['customerName', 'customerAddress'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => input.setCustomValidity(''));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('customerName');
    const address = document.getElementById('customerAddress');
    name.setCustomValidity(name.value.trim().length < 3 ? 'Isi nama minimal 3 karakter.' : '');
    address.setCustomValidity(address.value.trim().length < 5 ? 'Isi alamat minimal 5 karakter.' : '');
    if (!form.reportValidity()) return;
    const cart = readCart();
    if (!cart.length) { renderOrders(); toast('Pilih menu sebelum membuat pesanan.', true); return; }
    pending = {
      cart,
      name: name.value.trim(),
      email: document.getElementById('customerEmail').value.trim(),
      address: address.value.trim(),
      notes: document.getElementById('orderAddons').value.trim()
    };
    const items = document.getElementById('confirmationItems');
    items.replaceChildren();
    cart.forEach(item => {
      const row = document.createElement('li');
      const label = document.createElement('span');
      const amount = document.createElement('strong');
      label.textContent = `${item.quantity} × ${item.name}`;
      amount.textContent = money(item.quantity * item.price);
      row.append(label, amount); items.append(row);
    });
    const delivery = document.getElementById('deliveryPreview');
    delivery.replaceChildren();
    [pending.name, pending.email, pending.address, pending.notes && `Catatan: ${pending.notes}`].filter(Boolean).forEach(text => {
      const line = document.createElement('p'); line.textContent = text; delivery.append(line);
    });
    document.getElementById('confirmTotal').textContent = money(total(cart));
    confirmError.hidden = true;
    confirmButton.disabled = false;
    openDialog(confirmDialog);
  });

  confirmButton.addEventListener('click', () => {
    if (!pending || confirmButton.disabled) return;
    // Prevent confirming an outdated total after the cart changes in another tab.
    if (JSON.stringify(readCart()) !== JSON.stringify(pending.cart)) {
      confirmError.textContent = 'Pesanan berubah di tab lain. Tutup pop-up dan tinjau ulang pesanan.';
      confirmError.hidden = false;
      confirmButton.disabled = true;
      renderOrders();
      return;
    }
    confirmButton.disabled = true;
    if (!writeCart([])) {
      confirmError.textContent = 'Order belum selesai. Izinkan penyimpanan browser lalu coba lagi.';
      confirmError.hidden = false;
      confirmButton.disabled = false;
      return;
    }
    const count = pending.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('successDescription').textContent = `Terima kasih, ${pending.name}. Ringkasan ${count} item pesananmu sudah dikonfirmasi dan keranjang telah dikosongkan.`;
    document.getElementById('successTotal').textContent = money(total(pending.cart));
    // Clear storage before rendering so the completed cart disappears immediately.
    form.reset(); renderOrders(); confirmDialog.close();
    openDialog(successDialog);
    pending = null;
  });
  confirmDialog.addEventListener('close', () => {
    // Another dialog may already have opened during the same event loop.
    if (successDialog.open) document.body.classList.add('dialog-open');
  });
  successDialog.addEventListener('close', () => list.querySelector('a')?.focus());
  window.addEventListener('storage', event => { if (event.key === 'orders' || event.key === null) renderOrders(); });
  renderOrders();
});
