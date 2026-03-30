export function formatRp(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

export function parseAmount(str) {
  return parseInt(String(str).replace(/\D/g, ''), 10) || 0;
}