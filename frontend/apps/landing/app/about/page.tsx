export default function AboutPage() {
  return (
    <section className="relative z-20 mx-auto max-w-5xl px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">О нас</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-3xl">
        Мы создаём пространство для баланса разума и тела. Ниже — текст-рыба и заглушки для визуального стиля.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="prose prose-zinc max-w-none">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec est ut lorem venenatis varius. Aenean ut
            justo vitae ipsum aliquet faucibus. Integer fringilla, augue ac varius rhoncus, lorem lorem suscipit arcu, at
            placerat dolor lectus at turpis. Suspendisse potenti. Maecenas sodales, arcu quis fermentum volutpat, purus urna
            ullamcorper erat, quis pulvinar tellus nisl ut orci.
          </p>
          <p>
            Cras feugiat, magna ut bibendum luctus, lorem ipsum sollicitudin libero, vel tempor ipsum leo non neque. Aliquam
            erat volutpat. Praesent commodo, nibh in tempor tristique, lectus arcu facilisis ante, at fermentum lorem odio nec
            felis. Phasellus at sodales risus. Sed id est nec nulla pellentesque volutpat vitae in magna.
          </p>
          <ul>
            <li>Индивидуальный подход и экспертный контент.</li>
            <li>Сообщество поддержки и регулярные практики.</li>
            <li>Современные форматы: видеоуроки, эфиры, статьи.</li>
          </ul>
          <p>
            Quisque posuere iaculis tristique. Vivamus a malesuada nunc. Pellentesque id feugiat risus. In non porta purus.
            Vivamus vitae justo gravida, ullamcorper nisl eu, laoreet lectus. Integer efficitur auctor ante, a consequat mauris
            volutpat vitae.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/80" />
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/80" />
          <div className="col-span-2 aspect-[21/9] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/80" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map((i)=> (
          <div key={i} className="rounded-2xl p-6 ring-1 ring-gray-200/80 bg-white/70 backdrop-blur">
            <div className="h-28 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4" />
            <h3 className="text-lg font-medium mb-2">Карточка {i}</h3>
            <p className="text-sm text-gray-600">Короткое описание блока с рыбой для демонстрации композиции контента и визуальной иерархии.</p>
          </div>
        ))}
      </div>
    </section>
  );
}


