import { Link } from 'react-router-dom';
import placeholderProduct from '../assets/images/placeholder-product.jpg';

export default function ItemCard({ item, index, count }) {
    return (
        <div key={item.id} className="group relative">
        <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
          <img alt={"placeholder product"} src={placeholderProduct} className="size-full object-cover" />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">
        <Link 
            key={item.id}
            to={`/items/${item.id}`}
            className={`block p-4 hover:bg-gray-50 transition-colors ${
              index !== count - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <span className="absolute inset-0" />
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">{item.price}</p>
      </div>
    )
}