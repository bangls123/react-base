export type BlockType =
    | 'navbar'
    | 'hero'
    | 'features'
    | 'testimonial'
    | 'pricing'
    | 'cta'
    | 'gallery'
    | 'team'
    | 'faq'
    | 'contact'
    | 'footer'
    | 'stats'
    | 'content'
    | 'sidebar'
    | 'image'
    | 'unknown'

export type DetectionStrategy = 'semantic' | 'class' | 'content' | 'fallback'

export interface EditableProp {
    key: string
    value: string
    type: 'text' | 'image' | 'url' | 'color'
}

export interface Block {
    id: string
    order: number
    type: BlockType
    strategy: DetectionStrategy   // chiến lược nào đã phát hiện ra block này
    confidence: number            // 0.0 – 1.0
    tag: string                   // thẻ HTML gốc (section, div, header…)
    classes: string               // class names gốc (tối đa 5)
    editableProps: EditableProp[] // các trường có thể chỉnh sửa
    rawHTML: string               // HTML thô để đóng gói thành component
}

// ─── Config ──────────────────────────────────────────────────

/**
 * Map từ semantic HTML5 tag → block type
 * null = không ánh xạ (vd: <main> là wrapper, không phải block)
 */
const SEMANTIC_TAG_MAP: Record<string, BlockType | null> = {
    HEADER: 'navbar',
    NAV: 'navbar',
    FOOTER: 'footer',
    ASIDE: 'sidebar',
    ARTICLE: 'content',
    FIGURE: 'image',
    MAIN: null,  // wrapper — bỏ qua
}

/**
 * Patterns nhận diện loại block qua class name / id
 * Thứ tự quan trọng — pattern đầu tiên khớp sẽ được dùng
 */
const CLASS_PATTERNS: Array<{ re: RegExp; type: BlockType }> = [
    { re: /hero|banner|jumbotron|splash|masthead/i, type: 'hero' },
    { re: /nav|navbar|header|topbar|top-bar|site-header/i, type: 'navbar' },
    { re: /feature|service|benefit|why.us|about|solution/i, type: 'features' },
    { re: /testimonial|review|feedback|quote|client|customer/i, type: 'testimonial' },
    { re: /pric|plan|package|tier|subscription/i, type: 'pricing' },
    { re: /cta|call.to.action|signup|subscribe|get.started/i, type: 'cta' },
    { re: /gallery|portfolio|work|project|showcase/i, type: 'gallery' },
    { re: /team|member|staff|people|founder/i, type: 'team' },
    { re: /faq|question|accordion|collapse/i, type: 'faq' },
    { re: /contact|form|reach|touch/i, type: 'contact' },
    { re: /footer|bottom|foot/i, type: 'footer' },
    { re: /stat|counter|number|metric|count/i, type: 'stats' },
]

// ─── Strategy 1: Semantic Tag ─────────────────────────────────

function detectBySemanticTag(
    el: Element
): { type: BlockType; strategy: DetectionStrategy; confidence: number } | null {
    const tag = el.tagName.toUpperCase()

    if (!(tag in SEMANTIC_TAG_MAP)) return null

    const type = SEMANTIC_TAG_MAP[tag]
    if (!type) return null  // null = wrapper, bỏ qua

    return { type, strategy: 'semantic', confidence: 0.95 }
}

// ─── Strategy 2: Class / ID Heuristics ───────────────────────

function detectByClass(
    el: Element
): { type: BlockType; strategy: DetectionStrategy; confidence: number } | null {
    const combined = (
        (el.className || '') + ' ' + (el.id || '')
    ).toLowerCase()

    for (const { re, type } of CLASS_PATTERNS) {
        if (re.test(combined)) {
            return { type, strategy: 'class', confidence: 0.85 }
        }
    }
    return null
}

// ─── Strategy 3: Content / DOM Structure Analysis ────────────

/**
 * Đếm số lượng children có cùng cấu trúc (tag + class pattern)
 * Dùng để nhận diện danh sách lặp lại: features, team, testimonial…
 */
function countRepeatingChildren(el: Element): number {
    const children = Array.from(el.children)
    if (children.length < 2) return 0

    const counts: Record<string, number> = {}
    children.forEach(child => {
        // Dùng tagName + sorted class list làm fingerprint
        const fingerprint =
            child.tagName +
            Array.from(child.classList).sort().join('.')
        counts[fingerprint] = (counts[fingerprint] || 0) + 1
    })

    return Math.max(...Object.values(counts))
}

function detectByContent(
    el: Element
): { type: BlockType; strategy: DetectionStrategy; confidence: number } | null {
    const text = (el as HTMLElement).innerText ?? el.textContent ?? ''
    const words = text.trim().split(/\s+/).filter(Boolean).length

    // Queries DOM con
    const hasH1 = !!el.querySelector('h1')
    const hasH2 = !!el.querySelector('h2')
    const hasBtn = !!el.querySelector('button, a[class*="btn"], [class*="button"]')
    const hasImg = !!el.querySelector('img')
    const hasForm = !!el.querySelector('form, input[type="text"], input[type="email"]')
    const hasVideo = !!el.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]')
    const imgCount = el.querySelectorAll('img').length
    const hasQuote = !!el.querySelector('blockquote')
    const hasDetails = !!el.querySelector('details, [class*="accordion"], [class*="faq"]')
    const repeating = countRepeatingChildren(el)

    // Rules — thứ tự từ cụ thể → tổng quát
    if (hasForm)
        return { type: 'contact', strategy: 'content', confidence: 0.90 }

    if (hasDetails)
        return { type: 'faq', strategy: 'content', confidence: 0.88 }

    if (/\$|₫|\/month|\/mo|per month|pricing|gói|tháng/i.test(text))
        return { type: 'pricing', strategy: 'content', confidence: 0.85 }

    if (hasQuote || (hasImg && /["""'']|\bsaid\b|\breview\b/i.test(text)))
        return { type: 'testimonial', strategy: 'content', confidence: 0.75 }

    if (imgCount >= 4 && words < 50)
        return { type: 'gallery', strategy: 'content', confidence: 0.80 }

    if ((hasH1 || hasH2) && hasBtn && (hasImg || hasVideo))
        return { type: 'hero', strategy: 'content', confidence: 0.88 }

    if (hasBtn && !hasImg && words < 80)
        return { type: 'cta', strategy: 'content', confidence: 0.75 }

    if (/\d{2,}[k+%]?/.test(text) && words < 100 && !hasImg)
        return { type: 'stats', strategy: 'content', confidence: 0.70 }

    if (repeating >= 2 && repeating <= 6 && words > 20)
        return { type: 'features', strategy: 'content', confidence: 0.65 }

    return null
}

// ─── Prop Extractor ───────────────────────────────────────────

/**
 * Trích xuất các phần tử có thể chỉnh sửa trong 1 block
 * Kết quả dùng để sinh ra props cho React Component
 */
function extractEditableProps(el: Element): EditableProp[] {
    const props: EditableProp[] = []

    const h1 = el.querySelector('h1')
    const h2 = el.querySelector('h2')
    const h3 = el.querySelector('h3')
    const p = el.querySelector('p')
    const btn = el.querySelector('button, a[class*="btn"], [class*="button"]')
    const img = el.querySelector('img')
    const link = el.querySelector('a')

    if (h1) props.push({ key: 'title', value: h1.textContent?.trim() ?? '', type: 'text' })
    else if (h2) props.push({ key: 'title', value: h2.textContent?.trim() ?? '', type: 'text' })
    else if (h3) props.push({ key: 'title', value: h3.textContent?.trim() ?? '', type: 'text' })

    if (p) props.push({ key: 'subtitle', value: p.textContent?.trim() ?? '', type: 'text' })
    if (btn) props.push({ key: 'ctaText', value: btn.textContent?.trim() ?? '', type: 'text' })
    if (link && link !== btn) {
        props.push({ key: 'ctaUrl', value: link.getAttribute('href') ?? '#', type: 'url' })
    }
    if (img) {
        props.push({ key: 'image', value: img.getAttribute('src') ?? '', type: 'image' })
        const alt = img.getAttribute('alt')
        if (alt) props.push({ key: 'imageAlt', value: alt, type: 'text' })
    }

    // Background image từ inline style
    const bgImage = (el as HTMLElement).style?.backgroundImage
    if (bgImage && bgImage !== 'none') {
        const url = bgImage.replace(/url\(["']?(.+?)["']?\)/, '$1')
        props.push({ key: 'backgroundImage', value: url, type: 'image' })
    }

    // Background color từ inline style
    const bgColor = (el as HTMLElement).style?.backgroundColor
    if (bgColor && bgColor !== '' && bgColor !== 'transparent') {
        props.push({ key: 'backgroundColor', value: bgColor, type: 'color' })
    }

    return props
}

// ─── Root Section Finder ──────────────────────────────────────

/**
 * Tìm các "section gốc" của trang — không lồng trong section khác.
 *
 * Ưu tiên: semantic tags → direct children của body
 */
// ─── Component Block Finder (Bóc tách khối chi tiết) ──────────────────────

function findDetailedBlocks(doc: Document): Element[] {
    const body = doc.body
    if (!body) return []

    // Các thẻ kỹ thuật hoặc quá vụn vặt sẽ bị bỏ qua
    const IGNORE_TAGS = new Set(['SCRIPT', 'STYLE', 'META', 'LINK', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'PATH', 'BR', 'HR'])
    const blocks: Element[] = []

    function traverse(node: Element) {
        const tagName = node.tagName.toUpperCase()
        if (IGNORE_TAGS.has(tagName)) return

        // Ép kiểu để lấy thông tin style
        const htmlEl = node as HTMLElement

        // Bỏ qua các thẻ đang bị ẩn
        if (htmlEl.style?.display === 'none' || htmlEl.hidden) return

        // 1. Kiểm tra xem node có TÊN CLASS/ID nhận diện chức năng không?
        // (vd: <div class="hero-section">, <div class="pricing-table">)
        const classAndId = ((node.className || '') + ' ' + (node.id || '')).toLowerCase()
        const hasBlockClass = CLASS_PATTERNS.some(p => p.re.test(classAndId))

        // 2. Những thẻ mặc định luôn được coi là 1 "Block" đóng gói
        const isSemanticBlock = ['HEADER', 'FOOTER', 'SECTION', 'FORM', 'NAV'].includes(tagName)

        // NẾU LÀ KHỐI CHI TIẾT -> Lấy luôn và NGỪNG đệ quy
        // (Không lấy thẻ BODY hoặc MAIN dù chúng có match đi chăng nữa)
        if ((isSemanticBlock || hasBlockClass) && tagName !== 'BODY' && tagName !== 'MAIN') {
            blocks.push(node)
            return // Dừng! Không chui vào lấy các thẻ con bên trong nữa
        }

        // 3. NẾU LÀ WRAPPER (VD: <div> bọc ngoài, <main>, <article>)
        // -> Chúng ta tiếp tục "đào sâu" vào các thẻ con để tìm các khối chi tiết bên trong.
        const children = Array.from(node.children).filter(
            c => !IGNORE_TAGS.has(c.tagName.toUpperCase())
        )

        if (children.length > 0) {
            children.forEach(traverse)
        } else {
            // 4. FALLBACK: Nếu đã đào đến tận cùng (node lá) mà không match gì, 
            // nhưng nó lại chứa text dài hoặc là 1 bức ảnh -> Gom nó thành 1 block lẻ
            const text = htmlEl.innerText?.trim() || htmlEl.textContent?.trim() || ''
            if (text.length > 20 || tagName === 'IMG') {
                blocks.push(node)
            }
        }
    }

    // Bắt đầu quét đệ quy từ các thẻ con trực tiếp của body
    Array.from(body.children).forEach(traverse)

    return blocks
}

// ─── Main Parser ──────────────────────────────────────────────

export interface ParseResult {
    blocks: Block[]
    stats: {
        total: number
        identified: number
        unknown: number
        avgConfidence: number
    }
}

/**
 * Parse HTML string → danh sách Block đã phân loại
 *
 * @param htmlString  - Chuỗi HTML đầu vào (file, URL content, hay paste thủ công)
 * @returns ParseResult
 *
 * @example
 * const result = parseHTMLIntoBlocks('<header>...</header><section class="hero">...</section>')
 * console.log(result.blocks)
 * // [
 * //   { id: 'block_1', type: 'navbar', confidence: 0.95, ... },
 * //   { id: 'block_2', type: 'hero',   confidence: 0.88, ... },
 * // ]
 */
export function parseHTMLIntoBlocks(htmlString: string): ParseResult {
    // Dùng DOMParser để parse HTML — chạy an toàn trong browser sandbox
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    const sections = findDetailedBlocks(doc)
    const blocks: Block[] = []

    sections.forEach((el, index) => {
        const detection =
            detectBySemanticTag(el) ??
            detectByClass(el) ??
            detectByContent(el) ??
            { type: 'unknown' as BlockType, strategy: 'fallback' as DetectionStrategy, confidence: 0.2 }

        blocks.push({
            id: `block_${index + 1}`,
            order: index + 1,
            type: detection.type,
            strategy: detection.strategy,
            confidence: detection.confidence,
            tag: el.tagName.toLowerCase(),
            classes: Array.from(el.classList).slice(0, 5).join(' '),
            editableProps: extractEditableProps(el),
            rawHTML: el.outerHTML,
        })
    })

    // Thống kê
    const identified = blocks.filter(b => b.type !== 'unknown').length
    const avgConfidence =
        blocks.length > 0
            ? blocks.reduce((sum, b) => sum + b.confidence, 0) / blocks.length
            : 0

    return {
        blocks,
        stats: {
            total: blocks.length,
            identified,
            unknown: blocks.length - identified,
            avgConfidence: Math.round(avgConfidence * 100) / 100,
        },
    }
}

// ─── Optional: AI Fallback (gọi khi type === 'unknown') ──────

/**
 * Gọi Claude API để phân tích block 'unknown'
 * Dùng khi 3 strategies trên không nhận diện được
 *
 * @param rawHTML  - outerHTML của block cần phân tích
 * @returns BlockType đề xuất + confidence
 */
export async function detectByAI(
    rawHTML: string
): Promise<{ type: BlockType; confidence: number }> {
    const truncated = rawHTML.slice(0, 3000)  // giới hạn token

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 200,
            messages: [
                {
                    role: 'user',
                    content: `Phân tích đoạn HTML và trả về JSON duy nhất (không giải thích):
{
  "type": "navbar|hero|features|testimonial|pricing|cta|gallery|team|faq|contact|footer|stats|content|unknown",
  "confidence": <số từ 0.0 đến 1.0>
}

HTML:
${truncated}`,
                },
            ],
        }),
    })

    if (!res.ok) throw new Error(`Claude API error: ${res.status}`)

    const data = await res.json()
    const text: string = data.content?.[0]?.text ?? '{}'
    const cleaned = text.replace(/```json|```/g, '').trim()

    try {
        const parsed = JSON.parse(cleaned)
        return {
            type: (parsed.type as BlockType) ?? 'unknown',
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
        }
    } catch {
        return { type: 'unknown', confidence: 0 }
    }
}

/**
 * Phiên bản đầy đủ: chạy parser, sau đó gọi AI cho các block 'unknown'
 *
 * @param htmlString - Chuỗi HTML đầu vào
 */
export async function parseHTMLWithAIFallback(
    htmlString: string
): Promise<ParseResult> {
    const result = parseHTMLIntoBlocks(htmlString)

    // Chỉ gọi AI cho block chưa nhận diện được
    const unknownBlocks = result.blocks.filter(b => b.type === 'unknown')

    await Promise.all(
        unknownBlocks.map(async block => {
            try {
                const aiResult = await detectByAI(block.rawHTML)
                block.type = aiResult.type
                block.confidence = aiResult.confidence
                block.strategy = 'fallback' // đánh dấu đây là kết quả từ AI
            } catch {
                // Giữ nguyên 'unknown' nếu AI call thất bại
            }
        })
    )

    // Cập nhật lại stats
    const identified = result.blocks.filter(b => b.type !== 'unknown').length
    result.stats.identified = identified
    result.stats.unknown = result.blocks.length - identified

    return result
}
