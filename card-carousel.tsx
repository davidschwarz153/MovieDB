import { useState, useRef, type TouchEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function CardCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const cards = [
    {
      title: "Karte 1",
      content: "Inhalt der ersten Karte",
    },
    {
      title: "Karte 2",
      content: "Inhalt der zweiten Karte",
    },
    {
      title: "Karte 3",
      content: "Inhalt der dritten Karte",
    },
    {
      title: "Karte 4",
      content: "Inhalt der vierten Karte",
    },
  ]

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isSignificantSwipe = Math.abs(distance) > 50 // minimum swipe distance threshold

    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swiped left, go to next slide
        const nextIndex = (activeIndex + 1) % cards.length
        setActiveIndex(nextIndex)
      } else {
        // Swiped right, go to previous slide
        const prevIndex = (activeIndex - 1 + cards.length) % cards.length
        setActiveIndex(prevIndex)
      }
    }

    // Reset values
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        className="overflow-hidden rounded-lg touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="m-2 h-64">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                    <p>{card.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center mt-4 gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              activeIndex === index ? "bg-primary scale-125" : "bg-muted hover:bg-primary/50",
            )}
            aria-label={`Gehe zu Karte ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

