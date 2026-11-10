(function ($) {
  'use strict';
  $('#fiona-add-price').on('click', function () {
    $('#fiona-prices tbody').append('<tr><td><input type="number" name="fiona_minutes[]" min="1" max="480" step="1"></td><td><input type="number" name="fiona_price[]" min="1" step="1"></td><td><button type="button" class="button fiona-remove-price">Xóa dòng</button></td></tr>');
  });
  $('#fiona-prices').on('click', '.fiona-remove-price', function () { $(this).closest('tr').remove(); });
  $('#fiona-gallery').on('click', function () {
    const frame = wp.media({ title: 'Chọn ảnh dịch vụ Fiona', multiple: true, library: { type: 'image' }, button: { text: 'Dùng các ảnh này' } });
    frame.on('open', function () {
      ($('#fiona-gallery-ids').val() || '').split(',').filter(Boolean).forEach(function (id) { frame.state().get('selection').add(wp.media.attachment(Number(id))); });
    });
    frame.on('select', function () {
      const ids = frame.state().get('selection').map(function (item) { return item.id; });
      $('#fiona-gallery-ids').val(ids.join(','));
      $('#fiona-gallery-count').text(ids.length + ' ảnh');
    });
    frame.open();
  });
})(jQuery);
