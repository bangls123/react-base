import { Block } from './processChunkHtml';

export interface EditorComponentData {
    id: string;
    componentName: string;
    props: Record<string, any>;
    rawHTML: string;
}

export function mapBlocksToComponents(blocks: Block[]): EditorComponentData[] {
    const uniqueMap = new Map<string, EditorComponentData>();

    blocks.forEach(block => {
        // Chuyển editableProps thành mảng { key: value }
        const propsRecord: Record<string, any> = {};
        block.editableProps.forEach(prop => {
            propsRecord[prop.key] = prop.value;
        });

        // Ánh xạ BlockType sang tên React Component
        let componentName = 'RawHtmlBlock';
        switch (block.type) {
            case 'hero': componentName = 'HeroSection'; break;
            case 'navbar': componentName = 'NavbarSection'; break;
            case 'features': componentName = 'FeaturesSection'; break;
            case 'testimonial': componentName = 'TestimonialSection'; break;
            case 'pricing': componentName = 'PricingSection'; break;
            case 'cta': componentName = 'CTASection'; break;
            case 'gallery': componentName = 'GallerySection'; break;
            case 'team': componentName = 'TeamSection'; break;
            case 'faq': componentName = 'FAQSection'; break;
            case 'contact': componentName = 'ContactSection'; break;
            case 'footer': componentName = 'FooterSection'; break;
            case 'stats': componentName = 'StatsSection'; break;
            case 'content': componentName = 'ContentSection'; break;
            case 'sidebar': componentName = 'SidebarSection'; break;
            case 'image': componentName = 'ImageSection'; break;
            default: componentName = 'RawHtmlBlock'; break;
        }

        const componentData = {
            id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            componentName,
            props: propsRecord,
            rawHTML: block.rawHTML,
        };

        // Khóa Deduplication: Dựa vào Tên Component và Cấu trúc HTML (bỏ qua nội dung text)
        // Ví dụ 2 thẻ <div>Text 1</div> và <div>Text 2</div> sẽ có chung structureKey là "<div></div>"
        const structureKey = block.rawHTML.replace(/>[^<]*</g, '><').trim();
        const dedupeKey = `${componentName}_${structureKey}`;

        if (!uniqueMap.has(dedupeKey)) {
            uniqueMap.set(dedupeKey, componentData);
        }
    });

    return Array.from(uniqueMap.values());
}
