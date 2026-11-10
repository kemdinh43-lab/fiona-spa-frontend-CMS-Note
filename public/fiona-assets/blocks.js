(function (wp) {
  const el = wp.element.createElement;
  const ServerSideRender = wp.serverSideRender.default || wp.serverSideRender;
  ['services', 'packages', 'service-price', 'service-menu', 'social-videos', 'reviews', 'location-map'].forEach(function (name) {
    wp.blocks.registerBlockType('fiona/' + name, {
      apiVersion: 3,
      title: name === 'location-map' ? 'Fiona — Bản đồ địa chỉ' : name === 'reviews' ? 'Fiona — Đánh giá khách hàng' : name === 'social-videos' ? 'Fiona — Video trải nghiệm' : name === 'service-menu' ? 'Fiona — Menu dịch vụ & giá' : name === 'service-price' ? 'Fiona — Bảng giá dịch vụ' : name === 'services' ? 'Fiona — Dịch vụ & bộ lọc' : 'Fiona — Gói trải nghiệm',
      icon: name === 'services' ? 'palmtree' : 'tickets-alt', category: 'widgets',
      description: 'Dữ liệu lấy từ mục quản trị Fiona. Bạn có thể di chuyển khối này trên trang.',
      attributes: { ...(name === 'service-price' ? { serviceId: { type: 'number', default: 0 } } : {}), language: { type: 'string', default: 'vi' } },
      edit: function (props) {
        return el('div', wp.blockEditor.useBlockProps(),
          el(wp.blockEditor.InspectorControls, {}, el(wp.components.PanelBody, { title: 'Nội dung Fiona' }, el(wp.components.SelectControl, { label: 'Ngôn ngữ hiển thị', value: props.attributes.language, options: [{ label: 'Tiếng Việt', value: 'vi' }, { label: 'English', value: 'en' }], onChange: function (language) { props.setAttributes({ language: language }); } }))),
          el(ServerSideRender, { block: 'fiona/' + name, attributes: props.attributes, httpMethod: 'POST' })
        );
      }, save: function () { return null; }
    });
  });
})(window.wp);
