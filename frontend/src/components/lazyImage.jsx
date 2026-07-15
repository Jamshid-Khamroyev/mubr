import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function LazyLoad({ src, height = "h-[400px]", width = "w-full" }) {
  return (
    <LazyLoadImage
      alt="Example"
      src={src}
      width="100%"
      effect="blur" 
      className={`rounded-md object-fill ${height} ${width}`}
    />
  );
}
