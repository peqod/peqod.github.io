module Ontodesign
  IMG_TAG = /<img\b[^>]*?>/im.freeze
  IMG_SRC = /<img\b[^>]*?\bsrc="([^"]+)"/im.freeze
  WIKILINK_IMG = /!\[\[[^\]]+?\]\]/.freeze
  MD_IMG = /!\[[^\]]*\]\([^)]+\)/.freeze
end

module Jekyll
  module PostPreviewFilters
    def first_image_src(html)
      return nil if html.nil?
      m = html.match(Ontodesign::IMG_SRC)
      m && m[1]
    end

    def strip_first_image(content)
      return content if content.nil?
      [Ontodesign::WIKILINK_IMG, Ontodesign::MD_IMG, Ontodesign::IMG_TAG].each do |re|
        if content =~ re
          return content.sub(re, "")
        end
      end
      content
    end
  end
end

Liquid::Template.register_filter(Jekyll::PostPreviewFilters)
