import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface DeliveryMapProps {
  restaurantAddress: string
  deliveryAddress: string
}

export default function DeliveryMap({ restaurantAddress, deliveryAddress }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
      version: 'weekly',
    })

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 12,
        })

        const directionsService = new google.maps.DirectionsService()
        const directionsRenderer = new google.maps.DirectionsRenderer()

        directionsRenderer.setMap(map)

        directionsService.route(
          {
            origin: restaurantAddress,
            destination: deliveryAddress,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              directionsRenderer.setDirections(result)
            }
          }
        )
      }
    })
  }, [restaurantAddress, deliveryAddress])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}

