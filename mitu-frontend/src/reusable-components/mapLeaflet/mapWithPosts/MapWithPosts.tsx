import { Marker, Polygon, Popup, useMapEvents } from 'react-leaflet';
import type { Map } from 'leaflet';
import { divIcon, LatLng } from 'leaflet';

import { useMapWithPostsStore } from '@/core/stores/map/map-with-posts-store';
import MarkerablePostDto from '../../../core/api/post/dto/markerable-post';
import { memo, useEffect, useRef, useState } from 'react';
import MapContainerWrapper from '../MapContainerWrapper/MapContainerWrapper';
import { useMapSettingsStore } from '@/core/stores/map/map-settings-store';
import CitifiedTileLayer from '@/reusable-components/mapLeaflet/tileLayer/CitifiedTileLayer';
import { DynamicIconComponent } from '../DynamicIcon/DynamicIcon';
import {
  ANNOUNCEMENT_NAME,
  INVESTMENT_NAME,
  LISTING_NAME,
  PostTypeColor,
} from '@/strings';
import { LeftPanelState, useUiStore } from '@/core/stores/ui-store';

import ReactDOMServer from 'react-dom/server';
import AnnouncementPopup from './AnnouncementPopup';
import InvestmentPopup from './InvestmentPopup';
import ListingPopup from './ListingPopup';

function Markers({
  postList,
  mapEvents,
}: {
  postList: MarkerablePostDto[];
  mapEvents: Map;
}) {
  const {
    specificPost,
    setSpecificPost,
    postType,
    specificPostForceFlag,
    clearSpecificPostForceFlag,
  } = useMapWithPostsStore();
  const specificPostRef = useRef();
  const [popupReady, setPopupReady] = useState(false);

  useEffect(() => {
    if (specificPost == null || !popupReady) return;
    setPopupReady(false);
    // @ts-ignore
    specificPostRef.current?.openOn(mapEvents);
    clearSpecificPostForceFlag();
  }, [popupReady, specificPostForceFlag]);

  return postList.map((post) => {
    const di = divIcon({
      className: 'di-blank',
      html: ReactDOMServer.renderToString(
        <DynamicIconComponent
          key={post.id}
          id={`${post.id}`}
          icon={
            post.category?.icon
              ? post.category.icon
              : post.sell
                ? 'home'
                : 'key'
          }
          color={PostTypeColor[post.postType]}
        />,
      ),
    });

    return (
      <Marker
        eventHandlers={{
          click: () => {
            if (specificPost === null) setSpecificPost(post);
            else if (specificPost.id === post.id) setSpecificPost(null);
            else setSpecificPost(post);
          },
        }}
        title={post.title}
        key={post.id}
        position={[post.locationX, post.locationY]}
        icon={di}
      >
        <Popup
          autoPan={false}
          closeButton={false}
          ref={(r) => {
            if (specificPost?.id === post.id) {
              // @ts-ignore
              specificPostRef.current = r;
              setPopupReady(true);
            }
          }}
        >
          {(() => {
            switch (post.postType.toLocaleLowerCase()) {
              case INVESTMENT_NAME:
                return <InvestmentPopup post={post} />;
              case ANNOUNCEMENT_NAME:
                return <AnnouncementPopup post={post} />;
              case LISTING_NAME:
                return <ListingPopup post={post} />;
              default:
                return null;
            }
          })()}
        </Popup>
      </Marker>
    );
  });
}

function Area() {
  const { specificPost } = useMapWithPostsStore();
  if (specificPost === null || !specificPost.area) return <></>;
  const area = specificPost.area.split(';').map((markerPoints) => {
    const [x, y] = markerPoints.split(',').map((point) => parseFloat(point));
    return new LatLng(x, y);
  });
  return <Polygon pathOptions={{ color: 'red' }} positions={area} />;
}

function MapMain() {
  const mapStore = useMapWithPostsStore();
  const { setCenter, center, forcedCenter, clearForceFlag } =
    useMapSettingsStore();
  const { leftPanelState } = useUiStore();

  const mapEvents: Map = useMapEvents({
    moveend: () => {
      const bounds = mapEvents.getBounds();
      mapStore.setNESW(
        bounds.getNorth(),
        bounds.getEast(),
        bounds.getSouth(),
        bounds.getWest(),
      );
      setCenter(mapEvents.getCenter());
    },
    click: () => {
      if (mapStore.specificPost) {
        mapStore.setSpecificPost(null);
      }
    },
  });
  useEffect(() => {
    mapEvents.panTo(center);
    clearForceFlag();
  }, [forcedCenter]);

  useEffect(() => {
    if (leftPanelState !== LeftPanelState.ALL_HIDDEN) {
      setTimeout(() => {
        mapEvents.invalidateSize(true);
      }, 100);
    }
  }, [leftPanelState]);

  return (
    <>
      <CitifiedTileLayer />
      <Markers postList={mapStore.postsList} mapEvents={mapEvents} />
      <Area />
    </>
  );
}

function MapWithPosts({}) {
  const { fetchPosts, postType } = useMapWithPostsStore();
  useEffect(() => {
    fetchPosts();
  }, [postType]);

  return (
    <MapContainerWrapper>
      <MapMain />
    </MapContainerWrapper>
  );
}

export default memo(MapWithPosts);
