export default function ContactsPage() {
  return (
    <section className="relative z-20 mx-auto max-w-5xl px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Контакты</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-3xl">
        Текст-рыба: свяжитесь с нами по любому удобному каналу, мы открыты к диалогу.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl p-6 ring-1 ring-gray-200/80 bg-white/70 backdrop-blur">
          <h3 className="text-base font-medium mb-2">Email</h3>
          <p className="text-sm text-gray-600">hello@example.com</p>
        </div>
        <div className="rounded-2xl p-6 ring-1 ring-gray-200/80 bg-white/70 backdrop-blur">
          <h3 className="text-base font-medium mb-2">Телефон</h3>
          <p className="text-sm text-gray-600">+7 (000) 000-00-00</p>
        </div>
        <div className="rounded-2xl p-6 ring-1 ring-gray-200/80 bg-white/70 backdrop-blur">
          <h3 className="text-base font-medium mb-2">Социальные сети</h3>
          <p className="text-sm text-gray-600">Instagram / Telegram / YouTube</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Мы на карте</h2>
        <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/80 flex items-center justify-center text-gray-500">
          Карта (заглушка)
        </div>
      </div>
    </section>
  );
}


