require "fileutils"
require "uri"

module Ontodesign
  IMAGE_EXTS = %w[.png .jpg .jpeg .gif .svg .webp .bmp .avif .ico].freeze
  SKIP_DIRS = %w[.git .obsidian node_modules .trash _site .jekyll-cache vendor site docs].freeze

  class VaultImageIndex
    attr_reader :by_basename, :by_relpath, :root

    def initialize(root)
      @root = root
      @by_basename = {}
      @by_relpath = {}
      walk(root)
    end

    private

    def walk(dir)
      Dir.foreach(dir) do |entry|
        next if entry == "." || entry == ".."
        next if SKIP_DIRS.include?(entry)
        path = File.join(dir, entry)
        if File.directory?(path)
          walk(path)
        elsif IMAGE_EXTS.include?(File.extname(entry).downcase)
          rel = path.sub(@root + File::SEPARATOR, "").tr("\\", "/")
          @by_relpath[rel] = path
          @by_basename[entry] ||= path
        end
      end
    end

    public

    def resolve(src, doc_dir)
      return nil if src =~ %r{\A(https?:|data:|//|#)}i
      decoded = URI::DEFAULT_PARSER.unescape(src.split("#").first.split("?").first)
      try_rel = File.expand_path(decoded, doc_dir)
      return try_rel if File.exist?(try_rel) && IMAGE_EXTS.include?(File.extname(try_rel).downcase)
      as_repo_rel = decoded.sub(%r{\A/+}, "").tr("\\", "/")
      return @by_relpath[as_repo_rel] if @by_relpath.key?(as_repo_rel)
      base = File.basename(decoded)
      return @by_basename[base] if @by_basename.key?(base)
      nil
    end
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  site.config["_vault_image_index"] = Ontodesign::VaultImageIndex.new(site.source)
  site.config["_vault_image_copies"] = {}
  idx = site.config["_vault_image_index"]
  Jekyll.logger.info "vault_images:", "indexed #{idx.by_relpath.size} image(s)"
end

def rewrite_img_srcs(html, index, copies, slug, doc_dir)
  html.gsub(/(<img\s+[^>]*?\bsrc=)"([^"]+)"/) do
    prefix = Regexp.last_match(1)
    src = Regexp.last_match(2)
    if src =~ %r{\A(https?:|data:)}i
      %(#{prefix}"#{src}")
    else
      abs = index.resolve(src, doc_dir)
      if abs.nil?
        Jekyll.logger.warn "vault_images:", "image not found: #{src} (post: #{slug})"
        %(#{prefix}"#{src}")
      else
        base = File.basename(abs)
        rel_dest = "/posts/_assets/#{slug}/#{base}"
        copies[rel_dest] = abs
        %(#{prefix}"#{rel_dest}")
      end
    end
  end
end

Jekyll::Hooks.register :documents, :post_render do |doc|
  next unless doc.collection && %w[log projects about].include?(doc.collection.label)
  index = doc.site.config["_vault_image_index"]
  copies = doc.site.config["_vault_image_copies"]
  slug = File.basename(doc.url, ".html")
  next if slug.nil? || slug.empty?
  doc_dir = File.dirname(doc.path)
  doc.output = rewrite_img_srcs(doc.output, index, copies, slug, doc_dir) if doc.output
  doc.content = rewrite_img_srcs(doc.content, index, copies, slug, doc_dir) if doc.content
end

Jekyll::Hooks.register :site, :post_write do |site|
  copies = site.config["_vault_image_copies"] || {}
  copies.each do |rel_dest, source_path|
    dest = File.join(site.dest, rel_dest)
    FileUtils.mkdir_p(File.dirname(dest))
    FileUtils.cp(source_path, dest) unless File.exist?(dest)
  end
end
