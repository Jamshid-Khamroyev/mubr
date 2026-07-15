import NotFoundImage from '../assets/not-found.png'
import LazyLoad  from '../components/lazyImage'

const NotFound = () => {
  return (
    <div className="md:h-[99vh] pt-[10vh] w-[100vw] flex items-center justify-center">
      <LazyLoad src={NotFoundImage} height='md:h-[90vh]'/>
    </div>
  )
}

export default NotFound