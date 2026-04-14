import Link from 'next/link';
import PropTypes from 'prop-types';

const formatCurrency = (value) =>
    new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
    }).format(Number(value || 0));

const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const getProductTitle = (item) =>
    item?.product_snapshot?.title || item?.product?.title || 'Producto';

// Campos de dirección renombrados al inglés (post-refactoring)
const getAddress = (address) => {
    if (!address) return 'Dirección no disponible';
    const parts = [
        address.street,
        address.street_number,
        address.city,
        address.state,
        address.postal_code,
    ].filter(Boolean).join(', ');
    return parts || 'Dirección no disponible';
};

export default function OrderTicket({ order, showHistoryLink = false }) {
    const items = order?.items || [];

    return (
        <section className="mx-auto w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/80 p-4 shadow-xl sm:p-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-500/10 to-transparent" />

                {/* Header */}
                <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Comprobante de compra</p>
                        <h1 className="mt-2 text-2xl font-black tracking-tight text-zinc-50 sm:text-3xl">
                            Orden #{order?.order_number || '-'}
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">{formatDate(order?.created_at)}</p>
                    </div>

                    <div className="inline-flex h-fit w-fit items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                        COMPLETADA
                    </div>
                </div>

                {/* Tabla de items — campos renombrados: quantity y unit_price */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                    <table className="min-w-full text-sm">
                        <thead className="bg-zinc-950/80 text-zinc-400">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Producto</th>
                                <th className="px-4 py-3 text-right font-semibold">Cant.</th>
                                <th className="px-4 py-3 text-right font-semibold">Unit.</th>
                                <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                // campos renombrados: cantidad→quantity, precio_unitario→unit_price
                                const qty = Number(item?.quantity || 0);
                                const unit = Number(item?.unit_price || 0);
                                const subtotal = qty * unit;

                                return (
                                    <tr key={item.id} className="border-t border-zinc-800 text-zinc-200">
                                        <td className="px-4 py-3">{getProductTitle(item)}</td>
                                        <td className="px-4 py-3 text-right">{qty}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(unit)}</td>
                                        <td className="px-4 py-3 text-right font-semibold">{formatCurrency(subtotal)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="my-6 border-t border-dashed border-zinc-700" />

                {/* Footer — dirección + total */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dirección de envío</p>
                        <p className="mt-2 max-w-xl text-sm text-zinc-200">{getAddress(order?.address_snapshot)}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total</p>
                        <p className="text-3xl font-black leading-none text-emerald-300 sm:text-4xl">
                            {formatCurrency(order?.total)}
                        </p>
                    </div>
                </div>

                {showHistoryLink && (
                    <div className="mt-6 border-t border-zinc-800 pt-5">
                        <Link
                            href="/orders"
                            className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-200 shadow-sm transition hover:border-zinc-500 hover:shadow-md hover:text-white"
                        >
                            Ver historial de órdenes
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

OrderTicket.propTypes = {
    order: PropTypes.shape({
        order_number: PropTypes.string,
        created_at: PropTypes.string,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        // dirección renombrada a inglés
        address_snapshot: PropTypes.shape({
            street: PropTypes.string,
            street_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            city: PropTypes.string,
            state: PropTypes.string,
            postal_code: PropTypes.string,
        }),
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                // campos renombrados al inglés
                quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                unit_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                product_snapshot: PropTypes.shape({ title: PropTypes.string }),
                product: PropTypes.shape({ title: PropTypes.string }),
            })
        ),
    }),
    showHistoryLink: PropTypes.bool,
};