import Link from 'next/link';
import PropTypes from 'prop-types';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getItemsCount = (items = []) =>
  items.reduce((acc, item) => acc + Number(item?.cantidad || 0), 0);

export default function OrderSummaryCard({ order }) {
  const count = getItemsCount(order?.items || []);

  return (
    <Link
      href={`/orders/${order.order_number}`}
      className="block rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-zinc-600 hover:bg-zinc-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Orden</p>
          <p className="mt-1 text-xl font-black text-zinc-100">#{order?.order_number || '-'}</p>
          <p className="mt-2 text-sm text-zinc-400">{formatDate(order?.created_at)}</p>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-zinc-500">Items</p>
            <p className="font-bold text-zinc-100">{count}</p>
          </div>
          <div>
            <p className="text-zinc-500">Total</p>
            <p className="font-bold text-emerald-300">{formatCurrency(order?.total)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

OrderSummaryCard.propTypes = {
  order: PropTypes.shape({
    order_number: PropTypes.string,
    created_at: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        cantidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }),
};