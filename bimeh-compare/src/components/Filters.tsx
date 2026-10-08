import { CompanySearch } from './CompanySearch';
import type { InsuranceType, SortOrder } from '../types';

type Props = {
  type: InsuranceType;
  sort: SortOrder;
  company: string;
  onTypeChange: (type: InsuranceType) => void;
  onSortChange: (sort: SortOrder) => void;
  onCompanyChange: (company: string) => void;
};

export function Filters({ type, sort, company, onTypeChange, onSortChange, onCompanyChange }: Props) {
  return (
    <section className="filters">
      <div className="filters-row">
        <div className="field">
          <label htmlFor="type">نوع بیمه</label>
          <select
            id="type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as InsuranceType)}
          >
            <option value="third-party">شخص ثالث</option>
            <option value="body">بدنه</option>
            <option value="travel">مسافرتی</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="sort">مرتب‌سازی</label>
          <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value as SortOrder)}>
            <option value="default">پیش‌فرض</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </div>

        <CompanySearch value={company} onSelect={onCompanyChange} />
      </div>
    </section>
  );
}
