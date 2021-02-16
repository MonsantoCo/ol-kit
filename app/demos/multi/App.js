import React from 'react'
import {
  Map,
  Popup,
  TabbedPanel,
  Controls,
  ContextMenu,
  loadDataLayer,
  LayerStyler,
  LayerPanelLayersPage,
  MultiMapManager,
  TabbedPanelPage,
  BasemapContainer,
  VectorLayer,
  DrawContainer,
  FlexMap,
  FullScreenFlex,
  createMap
} from '@bayer/ol-kit'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'

import Welcome from '../../Welcome'
import { create } from 'ol/transform'

class App extends React.Component {
  state = {
    multiMapConfig: {}
  }

  onMapInit = async (map) => {
    // create a vector layer and add to the map
    const layer = new VectorLayer({
      title: '1904Labs HQ',
      source: new olSourceVector({
        features: [new olFeature({
          feature_type: ['1904Labs HQ'],
          title: '1904Labs HQ',
          name: '1904Labs HQ',
          geometry: new olGeomPoint(fromLonLat([-90.24618, 38.636069]))
        })]
      })
    })

    map.addLayer(layer)

    const dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')

    dataLayer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))

    window.map = map
  }

  render () {
    const multiMapConfig = [
      'map0',
      'map1',
      'map2',
      'map3',
      'map4',
      'map5',
      'map6',
      'map7',
    ]

    return (
      <MultiMapManager groups={[['map0', 'map1'],['map2', 'map3']]}>
        <FullScreenFlex>
          {multiMapConfig.map((key, i, array) => {
            return (
              <FlexMap
                key={key}
                index={i}
                total={array.length}
                numberOfRows={2}
                numberOfColumns={4}>
                <Map id={key} _ol_kit_multi={true} onMapInit={this.onMapInit}>
                  <Popup />
                  <TabbedPanel>
                    {i === 0 && <TabbedPanelPage tabIcon='Home'>
                      <Welcome />
                    </TabbedPanelPage>}
                    <TabbedPanelPage label='Layers'>
                      <LayerPanelLayersPage />
                    </TabbedPanelPage>
                    <TabbedPanelPage label='Styles'>
                      <LayerStyler />
                    </TabbedPanelPage>
                    <TabbedPanelPage label='Draw'>
                      <DrawContainer style={{ position: 'relative', width: 'auto' }} />
                    </TabbedPanelPage>
                  </TabbedPanel>
                  <ContextMenu />
                  <Controls />
                  <BasemapContainer />
                </Map>
              </FlexMap>
            )
          })}
        </FullScreenFlex>
      </MultiMapManager>
    )
  }
}

export default App
