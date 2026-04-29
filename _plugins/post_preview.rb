module Ontodesign
  IMG_TAG = /<img\b[^>]*?>/im.freeze
  IMG_SRC = /<img\b[^>]*?\bsrc="([^"]+)"/im.freeze
end

module Jekyll
  module PostPreviewFilters
    def first_image_src(html)
      return nil if html.nil?
      m = html.match(Ontodesign::IMG_SRC)
      m && m[1]
    end

    def strip_first_image(html)
      return html if html.nil?
      html.sub(Ontodesign::IMG_TAG, "")
    end
  end
end

Liquid::Template.register_filter(Jekyll::PostPreviewFilters)
