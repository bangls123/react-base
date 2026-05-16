import React from 'react';
import { GlobeIcon, FacebookIcon, YoutubeIcon, TiktokIcon } from '@/shared/icons';
import { PlatformCard } from './PlatformCard';

export const PublishConfigStep: React.FC = () => {
    return (
        <div className="animate-in fade-in flex flex-col gap-4 duration-300 ">
            <PlatformCard
                title="Webiste"
                icon={<GlobeIcon />}
                tags169={['Mực Tím', 'Báo Tuổi Trẻ']}
                tags916={[]}
                publishType="wait"
                placeholder="Chọn site"
                platform="web"
            />
            <PlatformCard
                title="Facebook Page"
                icon={<FacebookIcon />}
                tags169={['Mực Tím', 'Truyền hình - Báo Tuổi Trẻ', 'Tuổi Trẻ Cười']}
                tags916={['Truyền hình - Báo Tuổi Trẻ']}
                publishType="wait"
                placeholder="Chọn page"
                platform="fb"
            />
            <PlatformCard
                title="Youtube"
                icon={<YoutubeIcon />}
                tags169={['Tuổi Trẻ Cười']}
                tags916={['Mực tím']}
                publishType="schedule"
                placeholder="Chọn page"
                platform="yt"
            />
            <PlatformCard
                title="Tiktok"
                icon={<TiktokIcon />}
                tags169={[]}
                tags916={['Mực tím']}
                publishType="wait"
                placeholder="Chọn kênh"
                platform="web"
            />
        </div>
    );
};
