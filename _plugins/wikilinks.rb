require "uri"

module Ontodesign
  WIKILINK_EMBED = /!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/.freeze

  def self.expand_wikilinks(content)
    content.gsub(WIKILINK_EMBED) do
      target = Regexp.last_match(1).strip
      alt = (Regexp.last_match(2) || File.basename(target, File.extname(target))).strip
      "![#{alt}](#{URI::DEFAULT_PARSER.escape(target)})"
    end
  end
end

Jekyll::Hooks.register :documents, :pre_render do |doc|
  next unless doc.extname == ".md" || doc.extname == ".markdown"
  doc.content = Ontodesign.expand_wikilinks(doc.content)
end
