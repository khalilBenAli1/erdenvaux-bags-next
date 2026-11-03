'use client';
import { ProductCard } from '@/components/ProductCard';
import { filterOptions, parseFilters, filterProducts } from '@/domain/filters';
import { slug } from '@/domain/catalog';
import { useUrlSearch, updateSearch, resetSearch } from '@/hooks/use-url-state';
import styles from './Collection.module.css';
export function Collection() {
  const filters = parseFilters(useUrlSearch());
  const products = filterProducts(filters);
  return (
    <section aria-label="Bag collection">
      <div className={styles.filters}>
        {[
          {
            key: 'silhouette',
            label: 'Silhouette',
            options: filterOptions.silhouettes,
            value: filters.silhouette,
          },
          {
            key: 'material',
            label: 'Material',
            options: filterOptions.materials,
            value: filters.material,
          },
          {
            key: 'color',
            label: 'Colour',
            options: filterOptions.colors,
            value: filters.color,
          },
        ].map((filter) => (
          <div className={styles.filter} key={filter.key}>
            <label htmlFor={`filter-${filter.key}`}>{filter.label}</label>
            <select
              id={`filter-${filter.key}`}
              value={filter.value}
              onChange={(event) =>
                updateSearch(filter.key, event.currentTarget.value)
              }
            >
              <option value="all">
                All{' '}
                {filter.label === 'Colour'
                  ? 'colours'
                  : `${filter.label.toLowerCase()}s`}
              </option>
              {filter.options.map((option) => (
                <option value={slug(option)} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className={styles.filter}>
          <label htmlFor="filter-price">Price</label>
          <select
            id="filter-price"
            value={filters.price ?? 'all'}
            onChange={(event) =>
              updateSearch('price', event.currentTarget.value)
            }
          >
            <option value="all">All prices</option>
            <option value="500">Up to €500</option>
            <option value="700">Up to €700</option>
            <option value="1000">Up to €1,000</option>
          </select>
        </div>
        <div className={styles.filter}>
          <label htmlFor="filter-sort">Sort by</label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(event) =>
              updateSearch('sort', event.currentTarget.value)
            }
          >
            <option value="featured">Collection order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      <div className={styles.status}>
        <p role="status">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>
        <button type="button" className={styles.reset} onClick={resetSearch}>
          Reset filters
        </button>
      </div>
      {products.length ? (
        <div className={styles.grid}>
          {products.map((product) => {
            const variant = product.variants.find(
              (v) =>
                (filters.material === 'all' ||
                  slug(v.material) === filters.material) &&
                (filters.color === 'all' || slug(v.color) === filters.color),
            );
            return (
              <ProductCard
                key={product.id}
                product={product}
                {...(variant ? { variant } : {})}
              />
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>A different combination, perhaps.</h2>
          <p>
            No pieces match this selection. Make a little room in your filters.
          </p>
          <button className={styles.reset} type="button" onClick={resetSearch}>
            Return to the full collection ↗
          </button>
        </div>
      )}
      <p className={styles.footnote}>
        Original fictional product concepts. Body dimensions, availability and
        prices are illustrative; no real purchase is made.
      </p>
    </section>
  );
}
